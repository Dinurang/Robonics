// server.js
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Robonics server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    server: 'Robonics API',
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Robonics server running on http://localhost:${PORT}`);
});