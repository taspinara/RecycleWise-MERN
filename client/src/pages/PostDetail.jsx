import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();               // URL’deki :id
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  // 1) Post ve yorumları çek
  useEffect(() => {
    async function fetchData() {
      try {
        const [{ data: postData }, { data: commentList }] = await Promise.all([
          api.get(`/api/posts/${id}`),
          api.get(`/api/posts/${id}/comments`)
        ]);
        setPost(postData);
        setComments(commentList);
      } catch (err) {
        console.error(err);
        setError('Veri yüklenirken hata oluştu.');
      }
    }
    fetchData();
  }, [id]);

  // 2) Yorum ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) {
      setError('Yorum boş olamaz.');
      return;
    }
    try {
      const { data: newComment } = await api.post(
        `/api/posts/${id}/comments`,
        { content: commentText.trim() },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComments([newComment, ...comments]);
      setCommentText('');
      setError('');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Yorum eklenirken hata oluştu.');
      }
    }
  };

  if (!post) {
    return <div className="p-6 text-center">Yükleniyor…</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6">
        {/* Post Başlığı ve İçerik */}
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-600">
          Yazar: {post.author.name} •{' '}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="prose">{post.content}</div>

        {/* Yorum Formu */}
        <div>
          <h2 className="text-2xl font-semibold">Yorum Yap</h2>
          {error && (
            <div className="alert alert-error mb-2">
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              className="textarea textarea-bordered w-full"
              rows="3"
              placeholder="Yorumunuzu yazın…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Gönder
            </button>
          </form>
        </div>

        {/* Yorum Listesi */}
        <div>
          <h2 className="text-2xl font-semibold">Yorumlar</h2>
          {comments.length === 0 ? (
            <p>Henüz yorum yok.</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => (
                <li key={c._id} className="border-b pb-4">
                  <p className="font-semibold">{c.author.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1">{c.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link to="/blog" className="btn btn-ghost">
          ← Geri dön
        </Link>
      </div>
    </div>
  );
}
