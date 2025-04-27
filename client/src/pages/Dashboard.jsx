import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Eğer girişli değilse login sayfasına yönlendir
    if (!user) {
      navigate('/login');
      return;
    }
    // Profil bilgisini çek
    async function fetchProfile() {
      try {
        const { data } = await api.get('/api/users/me');
        setProfile(data);
      } catch (err) {
        console.error(err);
        // Token geçersizse çıkış yap ve login’e dön
        logout();
        navigate('/login');
      }
    }
    fetchProfile();
  }, [user, navigate, logout]);

  if (!profile) {
    return <div className="p-6 text-center">Yükleniyor…</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Profilim</h1>
        <p><strong>Ad:</strong> {profile.name}</p>
        <p><strong>E-posta:</strong> {profile.email}</p>
        <p><strong>Eco Puan:</strong> {profile.ecoPoints}</p>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="btn btn-error mt-4"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
