// client/src/pages/Dashboard.jsx

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [scans, setScans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchData() {
      try {
        const [{ data: prof }, { data: scanList }] = await Promise.all([
          api.get('/api/users/me'),
          api.get('/api/users/scans')
        ]);
        setProfile(prof);
        setScans(scanList);
      } catch (err) {
        console.error(err);
        logout();
        navigate('/login');
      }
    }

    fetchData();
  }, [user, navigate, logout]);

  if (!profile) {
    return <div className="p-6 text-center">Yükleniyor…</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-6">
        <h1 className="text-3xl font-bold">Profilim</h1>
        <div>
          <p><strong>Ad:</strong> {profile.name}</p>
          <p><strong>E-posta:</strong> {profile.email}</p>
          <p><strong>Eco Puan:</strong> {profile.ecoPoints}</p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="btn btn-error"
        >
          Çıkış Yap
        </button>

        <div>
          <h2 className="text-2xl font-semibold">Toplam Tarama</h2>
          <p className="mb-4">Eco Puanınız: {profile.ecoPoints}</p>

          <h3 className="text-xl mb-2">Tarama Geçmişi</h3>
          {scans.length === 0 ? (
            <p>Henüz bir tarama yapmadınız.</p>
          ) : (
            <ul className="space-y-2">
              {scans.map((s) => (
                <li
                  key={s._id}
                  className={`p-3 rounded ${
                    s.recyclable ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div>
                    <strong>{new Date(s.date).toLocaleString()}</strong> –{' '}
                    {s.recyclable ? 'Geri Dönüşümlü' : 'Geri Dönüşümlü Değil'}
                  </div>
                  {s.instructions && (
                    <div className="text-sm text-gray-700">
                      Talimat: {s.instructions}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
