// client/src/pages/Challenges.jsx

import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Challenges() {
  const { token } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    async function fetchChallenges() {
      try {
        const { data } = await api.get('/api/challenges');
        setChallenges(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Challenge yüklenirken hata oluştu.');
      }
    }
    fetchChallenges();
  }, [token, navigate]);

  const handleComplete = async (id) => {
    try {
      await api.post(
        `/api/challenges/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompleted((prev) => [...prev, id]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Tamamlama hatası.');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-3xl font-bold text-center">Recycling Challenges</h1>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {challenges.length === 0 ? (
          <p className="text-center">Henüz bir challenge eklenmedi.</p>
        ) : (
          <ul className="space-y-4">
            {challenges.map((ch) => (
              <li key={ch._id} className="border p-4 rounded">
                <h2 className="text-xl font-semibold">{ch.title}</h2>
                <p className="mt-1">{ch.description}</p>
                <p className="mt-2"><strong>Puan:</strong> {ch.points}</p>
                <button
                  className={`btn mt-2 ${
                    completed.includes(ch._id) ? 'btn-disabled' : 'btn-primary'
                  }`}
                  onClick={() => handleComplete(ch._id)}
                  disabled={completed.includes(ch._id)}
                >
                  {completed.includes(ch._id) ? 'Tamamlandı' : 'Tamamla'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
