import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await api.get('/api/posts');
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Blog yüklenirken hata oluştu.');
      }
    }
    fetchPosts();
  }, []);

  // İçerikten ilk 100 karakteri gösteren yardımcı fonksiyon
  const excerpt = (content) =>
    content.length > 100 ? content.slice(0, 100) + '…' : content;

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-3xl font-bold text-center">Eco Blog</h1>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {posts.length === 0 ? (
          <p className="text-center">Henüz hiç yazı yok.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post._id} className="border-b pb-4">
                <Link to={`/posts/${post._id}`} className="text-2xl font-semibold hover:underline">
                  {post.title}
                </Link>
                <p className="text-sm text-gray-600">
                  Yazar: {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2">{excerpt(post.content)}</p>
                <Link
                  to={`/posts/${post._id}`}
                  className="text-primary mt-2 inline-block"
                >
                  Devamını Oku →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
