// client/src/pages/Leaderboard.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data } = await api.get('/api/leaderboard');
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Leaderboard yüklenirken hata oluştu.');
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-3xl font-bold text-center">Leaderboard</h1>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {users.length === 0 ? (
          <p className="text-center">Henüz kayıtlı kullanıcı yok.</p>
        ) : (
          <ol className="list-decimal list-inside space-y-2">
            {users.map((u, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{u.name}</span>
                <span className="font-semibold">{u.ecoPoints}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
