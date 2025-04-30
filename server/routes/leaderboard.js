// server/routes/leaderboard.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/leaderboard
 * Public endpoint: tüm kullanıcıları ecoPoints’a göre azalan sırada döner
 */
router.get('/', async (req, res) => {
  try {
    // Sadece name ve ecoPoints alanlarını al, desc sıralama
    const topUsers = await User.find()
      .sort({ ecoPoints: -1 })
      .select('name ecoPoints -_id'); 
      // -_id: id’yi istemiyorsanız çıkarır; dilerseniz silebilirsiniz
    res.json(topUsers);
  } catch (err) {
    console.error('Leaderboard Error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

export default router;
