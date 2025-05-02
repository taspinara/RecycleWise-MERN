// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scan from './pages/Scan';
import Leaderboard from './pages/Leaderboard';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';

import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/blog" element={<Blog />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
