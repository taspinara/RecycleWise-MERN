import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
app.use(cors());

// Dosya yükleme ayarları
const upload = multer({ storage: multer.memoryStorage() });

// /analyze endpoint’i – resim alır, sabit cevap döner
app.post('/analyze', upload.single('image'), (req, res) => {
  // İleride model ekleyene kadar her zaman recyclable = true dönüyoruz
  return res.json({
    recyclable: true,
    instructions: 'Mavi geri dönüşüm kutusuna atınız.'
  });
});

// Health check
app.get('/', (req, res) => res.send('Hello from RecycleWise AI Service!'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 AI Service running on http://localhost:${PORT}`);
});
