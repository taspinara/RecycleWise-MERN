// server/routes/scan.js
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import auth from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/scan
 * Protected: auth middleware
 * Body: multipart/form-data, field name: "image"
 * Response: AI servisten dönen JSON ({ recyclable: bool, instructions: string })
 */
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // AI servis URL'i, .env'den
    const aiUrl = `${process.env.AI_SERVICE_URL}/analyze`;

    // Multer ile alınan buffer'ı FormData'ya ekle
    const form = new FormData();
    form.append('image', req.file.buffer, req.file.originalname);

    // AI servisine istek
    const aiResponse = await axios.post(aiUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // Sonucu client'a ilet
    return res.json(aiResponse.data);
  } catch (error) {
    console.error('Scan Error:', error.message || error);
    return res.status(500).json({ message: 'Scan işleminde hata oluştu.' });
  }
});

export default router;
