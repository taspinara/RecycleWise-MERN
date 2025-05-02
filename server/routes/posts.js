import express from 'express';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';

const router = express.Router();

/**
 * GET   /api/posts        — tüm post’ları listeler
 * GET   /api/posts/:id    — tek bir post’u döner
 * POST  /api/posts        — yeni post oluşturur (korumalı)
 * PUT   /api/posts/:id    — var olan post’u günceller (korumalı, sadece author)
 * DELETE /api/posts/:id   — post’u siler (korumalı, sadece author)
 */

// 1) Listele (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Listeleme hatası.' });
  }
});

// 2) Tekil gösterim (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post bulunamadı.' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// “auth” middleware—bundan sonrası korumalı:
router.use(auth);

// 3) Oluştur
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await Post.create({
      author: req.user.id,
      title,
      content,
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Geçersiz veri.' });
  }
});

// 4) Güncelle (sadece yazar)
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post bulunamadı.' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Yetkisiz işlem.' });

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Güncelleme hatası.' });
  }
});

// 5) Sil (sadece yazar)
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post bulunamadı.' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Yetkisiz işlem.' });

    await post.deleteOne();
    res.json({ message: 'Post silindi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Silme hatası.' });
  }
});

export default router;
