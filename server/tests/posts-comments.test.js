// server/tests/posts-comments.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

process.env.JWT_SECRET = 'testsecret';

// Increase timeout for MongoMemoryServer downloads
jest.setTimeout(60000);

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  // 1) Start in‐memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });

  // 2) Create a test user and JWT
  const user = await User.create({
    name: 'Tester',
    email: 'tester@example.com',
    passwordHash: 'irrelevant',
    ecoPoints: 0,
  });
  userId = user._id.toString();
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('BlogPost CRUD API', () => {
  let postId;

  it('GET /api/posts should return empty array initially', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/posts should create a post (auth required)', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'First Post',
        content: 'Hello world!',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('First Post');
    expect(res.body.content).toBe('Hello world!');
    expect(res.body.author).toBe(userId);
    postId = res.body._id;
  });

  it('GET /api/posts should now return one post', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]._id).toBe(postId);
  });

  it('GET /api/posts/:id should return the created post', async () => {
    const res = await request(app).get(`/api/posts/${postId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(postId);
  });

  it('PUT /api/posts/:id should update title & content', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title', content: 'Updated content.' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.content).toBe('Updated content.');
  });

  it('DELETE /api/posts/:id should remove the post', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Post silindi.');
    // Ensure it's gone
    const check = await request(app).get(`/api/posts/${postId}`);
    expect(check.statusCode).toBe(404);
  });
});

describe('Comments API under /api/posts/:id/comments', () => {
  let post;

  beforeAll(async () => {
    // Create a fresh post for comments
    post = await Post.create({
      author: userId,
      title: 'Commented Post',
      content: 'Some content',
    });
  });

  it('GET /api/posts/:id/comments should return empty array', async () => {
    const res = await request(app).get(`/api/posts/${post._id}/comments`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/posts/:id/comments should add a comment', async () => {
    const res = await request(app)
      .post(`/api/posts/${post._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Great post!' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.content).toBe('Great post!');
    expect(res.body.author._id).toBe(userId);
    expect(res.body.post).toBe(post._id.toString());
  });

  it('GET /api/posts/:id/comments should now list one comment', async () => {
    const res = await request(app).get(`/api/posts/${post._id}/comments`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].content).toBe('Great post!');
  });

  it('POST /api/posts/:id/comments without token should 401', async () => {
    const res = await request(app)
      .post(`/api/posts/${post._id}/comments`)
      .send({ content: 'Another!' });
    expect(res.statusCode).toBe(401);
  });
});
