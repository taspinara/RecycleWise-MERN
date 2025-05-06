import express from 'express';
import auth from '../middleware/auth.js';
import Group from '../models/Group.js';
import GroupMessage from '../models/GroupMessage.js';
import User from '../models/User.js';

const router = express.Router();

/** PUBLIC: tüm grupları listeler */
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gruplar listelenemedi.' });
  }
});

/** PUBLIC: tek bir grubun bilgisi + üyeler listesi */
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('members', 'name email');
    if (!group) return res.status(404).json({ message: 'Grup bulunamadı.' });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Bundan sonrası korumalı:
router.use(auth);

/** POST /api/groups — yeni grup oluşturur */
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.create({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Geçersiz veri.' });
  }
});

/** POST /api/groups/:id/join — gruba katılma */
router.post('/:id/join', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Grup bulunamadı.' });
    // zaten üye mi?
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Zaten gruptasınız.' });
    }
    group.members.push(req.user.id);
    await group.save();
    res.json({ message: 'Gruba katıldınız.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Katılma hatası.' });
  }
});

/** GET  /api/groups/:id/messages — grup mesajlarını listeler */
router.get('/:id/messages', async (req, res) => {
  try {
    const messages = await GroupMessage.find({ group: req.params.id })
      .sort({ createdAt: 1 })
      .populate('author', 'name');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Mesajlar alınamadı.' });
  }
});

/** POST /api/groups/:id/messages — grup mesajı atma */
router.post('/:id/messages', async (req, res) => {
  try {
    const { content } = req.body;
    // membership kontrolü
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Grup bulunamadı.' });
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Grup üyesi değilsiniz.' });
    }
    const msg = await GroupMessage.create({
      group: group._id,
      author: req.user.id,
      content,
    });
    await msg.populate('author', 'name');
    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Mesaj gönderilemedi.' });
  }
});

export default router;
