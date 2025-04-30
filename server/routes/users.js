// server/routes/users.js
import express from 'express';
import User from '../models/User.js';
import Scan from '../models/Scan.js';

const router = express.Router();

// GET /api/users/me
// Korunan endpoint: auth middleware ile önce kimlik doğrulaması yapılır
router.get('/me', async (req, res) => {
  try {
    // auth middleware'de req.user.id ayarlanmış olmalı
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// GET /api/users/scans — kullanıcının tüm taramalarını döner
router.get('/scans', async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id })
      .sort({ date: -1 })
      .select('date recyclable instructions');
    res.json(scans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

export default router;
