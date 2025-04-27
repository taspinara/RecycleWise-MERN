// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Eğer kullanıcı girişli değilse, dashboard’a erişim engellenebilir */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Auth sayfaları */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Anasayfa yönlendirmesi */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
