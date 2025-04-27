import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');

  // Input değişimlerini yöneten handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form validasyonu
  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return 'Lütfen tüm alanları doldurun.';
    }
    if (!form.email.includes('@')) {
      return 'Geçerli bir e-posta girin.';
    }
    if (form.password.length < 6) {
      return 'Şifre en az 6 karakter olmalı.';
    }
    if (form.password !== form.confirm) {
      return 'Şifreler eşleşmiyor.';
    }
    return '';
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const { data } = await api.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // Kayıt başarılıysa login fonksiyonunu çağır ve dashboard’a yönlendir
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt sırasında hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md p-6 shadow-lg bg-white space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Kayıt Ol</h2>
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Adınız</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>

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

        <div className="form-control">
          <label className="label">
            <span className="label-text">Şifre Tekrar</span>
          </label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Kayıt Ol
        </button>

        <p className="text-center">
          Zaten üye misiniz?{' '}
          <Link to="/login" className="link link-primary">
            Giriş Yap
          </Link>
        </p>
      </form>
    </div>
  );
}
