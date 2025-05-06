// client/src/components/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          RecycleWise
        </Link>
      </div>
      <div className="flex-none space-x-2">
        <Link to="/challenges" className="btn btn-ghost">
          Challenges
        </Link>
        <Link to="/blog" className="btn btn-ghost">
          Blog
        </Link>
        <Link to="/leaderboard" className="btn btn-ghost">
          Leaderboard
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
            <Link to="/scan" className="btn btn-ghost">
              Scan
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost">
              Çıkış
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Giriş
            </Link>
            <Link to="/register" className="btn btn-primary ml-2">
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
