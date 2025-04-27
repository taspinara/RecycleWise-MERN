import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Lütfen e-posta ve şifre girin.');
      return;
    }
    try {
      const { data } = await api.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      // login fonksiyonuyla context'e token ve user kaydı
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm p-6 shadow-lg bg-white space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Giriş Yap</h2>
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">E-posta</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Şifre</span>
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Giriş Yap
        </button>

        <p className="text-center">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="link link-primary">
            Kayıt Ol
          </Link>
        </p>
      </form>
    </div>
  );
}
