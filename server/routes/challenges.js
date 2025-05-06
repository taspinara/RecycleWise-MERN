import express from 'express';
import auth from '../middleware/auth.js';
import Challenge from '../models/Challenge.js';
import Completion from '../models/ChallengeCompletion.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/challenges
 * Public: tüm challenge’ları listeler
 */
router.get('/', async (req, res) => {
  try {
    const list = await Challenge.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Challenge listelenemedi.' });
  }
});

/**
 * GET /api/challenges/:id
 * Public: tek bir challenge’ı döner
 */
router.get('/:id', async (req, res) => {
  try {
    const ch = await Challenge.findById(req.params.id);
    if (!ch) return res.status(404).json({ message: 'Challenge bulunamadı.' });
    res.json(ch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Bundan sonrası korumalı:
router.use(auth);

/**
 * POST /api/challenges
 * Yeni challenge oluşturur
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, points } = req.body;
    const newCh = await Challenge.create({ title, description, points });
    res.status(201).json(newCh);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Geçersiz veri.' });
  }
});

/**
 * PUT /api/challenges/:id
 * Challenge’ı günceller
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Challenge.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true },
    );
    if (!updated)
      return res.status(404).json({ message: 'Challenge bulunamadı.' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Güncelleme hatası.' });
  }
});

/**
 * DELETE /api/challenges/:id
 * Challenge’ı siler
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Challenge.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: 'Challenge bulunamadı.' });
    res.json({ message: 'Challenge silindi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Silme hatası.' });
  }
});

/**
 * POST /api/challenges/:id/complete
 * Kullanıcı challenge’ı tamamladığında:
 *  - Completion tablosuna ekle
 *  - User.ecoPoints’a challenge.points kadar ekle
 */
router.post('/:id/complete', async (req, res) => {
  try {
    const ch = await Challenge.findById(req.params.id);
    if (!ch) return res.status(404).json({ message: 'Challenge bulunamadı.' });

    // Aynı challenge’a ikinci kez puan vermesin:
    const already = await Completion.findOne({
      user: req.user.id,
      challenge: ch._id,
    });
    if (already) {
      return res.status(400).json({ message: 'Zaten tamamladınız.' });
    }

    // Kayıt oluştur ve puan ekle
    await Completion.create({ user: req.user.id, challenge: ch._id });
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { ecoPoints: ch.points },
    });

    res.json({ message: 'Challenge tamamlandı!', points: ch.points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Tamamlama hatası.' });
  }
});

export default router;
