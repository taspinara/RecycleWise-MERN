import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// Health check
app.get('/', (req, res) => res.send('Hello from RecycleWise AI Service!'));

// Analyze endpoint
app.post('/analyze', upload.single('image'), (req, res) => {
  // stub: sabit cevap
  res.json({ recyclable: true, instructions: 'Mavi geri dönüşüm kutusuna atınız.' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 AI Service running on http://localhost:${PORT}`));
