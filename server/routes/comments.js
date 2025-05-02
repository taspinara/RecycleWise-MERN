import express from 'express';
import auth from '../middleware/auth.js';
import Comment from '../models/Comment.js';

const router = express.Router({ mergeParams: true });

/**
 * GET  /api/posts/:id/comments
 * List all comments for a post (public)
 */
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name');
    res.json(comments);
  } catch (err) {
    console.error('Comments GET Error:', err);
    res.status(500).json({ message: 'Yorumlar yüklenirken hata oluştu.' });
  }
});

/**
 * POST /api/posts/:id/comments
 * Add a comment to a post (protected)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Yorum içeriği boş olamaz.' });
    }
    const newComment = await Comment.create({
      post: req.params.id,
      author: req.user.id,
      content: content.trim(),
    });
    // populate author name before returning
    await newComment.populate('author', 'name');
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Comments POST Error:', err);
    res.status(500).json({ message: 'Yorum eklenirken hata oluştu.' });
  }
});

export default router;
