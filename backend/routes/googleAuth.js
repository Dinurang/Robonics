// backend/routes/googleAuth.js
import express from 'express';
import { generateAuthUrl, handleOAuthCallback } from '../googleDrive/googleDriveAuth.js';

const router = express.Router();

router.get('/login', (req, res) => {
  const url = generateAuthUrl();
  res.redirect(url);
});

router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');
  try {
    await handleOAuthCallback(code);
    res.send('Google Drive authentication successful! You can close this tab.');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Authentication failed. See server logs.');
  }
});

export default router;
