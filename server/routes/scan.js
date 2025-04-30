// server/routes/scan.js
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

import auth from '../middleware/auth.js';

import User from '../models/User.js';
import Scan from '../models/Scan.js';

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
    // console.log('Calling AI at:', aiUrl);
    // console.log('File size:', req.file?.buffer?.length);

    // Multer ile alınan buffer'ı FormData'ya ekle
    const form = new FormData();
    form.append('image', req.file.buffer, req.file.originalname);
    // console.log(req.file)

    // AI servisine istek
    const aiResponse = await axios.post(aiUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // AI cevabını alın
    const data = aiResponse.data;
    // 1) ecoPoints arttırma
    if (data.recyclable) {
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { ecoPoints: 1 } },
        { new: true },
      );
    }
    // 2) Scan kaydı oluştur
    await Scan.create({
      user: req.user.id,
      recyclable: data.recyclable,
      instructions: data.instructions,
    });
    // Sonucu client’a gönder
    return res.json(data);
  } catch (error) {
    console.error('Scan Error:', error.message || error);
    return res.status(500).json({ message: 'Scan işleminde hata oluştu.' });
  }
});

export default router;
