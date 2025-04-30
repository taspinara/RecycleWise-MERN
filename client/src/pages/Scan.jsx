import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Scan() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Seçilen dosya ve önizleme URL’i
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Sunucu cevabı
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Dosya seçildiğinde çağrılır
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    // Önizleme için URL yarat
    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);
    // Önceki sonucu temizle
    setResult(null);
    setError('');
  };

  // Form submit: resmi scan endpoint’ine gönder
  const handleScan = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Lütfen önce bir görsel seçin.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/api/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Tarama sırasında hata oluştu.');
    }
  };

  // Eğer oturum yoksa login’e gönder
  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200 p-6 flex flex-col items-center">
      <div className="card w-full max-w-lg bg-white p-6 space-y-6 shadow">
        <h2 className="text-2xl font-bold text-center">Material Scanner</h2>

        {/* Dosya Seçimi */}
        <div className="form-control">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Önizleme */}
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 object-contain border p-2"
            />
          </div>
        )}

        {/* Hata Mesajı */}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Tarama Başlat Butonu */}
        <button
          onClick={handleScan}
          className="btn btn-primary w-full"
        >
          Tarama Başlat
        </button>

        {/* Sonuç Gösterimi */}
        {result && (
          <div className="alert alert-success mt-4">
            <p><strong>Geri Dönüşümlü:</strong> {result.recyclable ? 'Evet' : 'Hayır'}</p>
            <p><strong>Talimatlar:</strong> {result.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
