// server/tests/scan.test.js
import { jest } from '@jest/globals';      // ← add this
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../models/User.js';
import Scan from '../models/Scan.js';
import axios from 'axios';

// 1) Stub axios.post to return a fixed AI response
jest.mock('axios');
axios.post.mockResolvedValue({
  data: { recyclable: true, instructions: 'Test talimat.' }
});

process.env.JWT_SECRET = 'testsecret';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /api/scan', () => {
  let token, userId;

  beforeAll(async () => {
    // 2) Create test user
    const user = await User.create({
      name: 'ScanTester',
      email: 'scan@test.com',
      passwordHash: 'irrelevant',
      ecoPoints: 0
    });
    userId = user._id.toString();
    // 3) Sign JWT
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  });

  it('should return AI result and increment ecoPoints', async () => {
    const res = await request(app)
      .post('/api/scan')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('dummy'), 'dummy.png');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      recyclable: true,
      instructions: 'Test talimat.'
    });

    // 4) Check ecoPoints increment
    const updated = await User.findById(userId);
    expect(updated.ecoPoints).toBe(1);

    // 5) Check scan record
    const scans = await Scan.find({ user: userId });
    expect(scans).toHaveLength(1);
    expect(scans[0].recyclable).toBe(true);
    expect(scans[0].instructions).toBe('Test talimat.');
  });

  it('should reject without token', async () => {
    const res = await request(app)
      .post('/api/scan')
      .attach('image', Buffer.from('dummy'), 'dummy.png');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
