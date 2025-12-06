import express from 'express';
import pool from '../../db.js';
import { authenticateToken } from '../middleware/middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { google } from 'googleapis';
import { getAuthenticatedClient, loadSavedCredentialsIfExist } from '../../googleDrive/googleDriveAuth.js';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: function (req, file, cb) {
    if (path.extname(file.originalname).toLowerCase() === '.zip') cb(null, true);
    else cb(new Error('Only .zip files are allowed'));
  }
});

// Helper: upload to personal Drive using saved OAuth tokens
async function uploadToGoogleDriveWithOAuth(filePath, fileName, folderId) {
  const authClient = loadSavedCredentialsIfExist();
  if (!authClient) throw new Error('Google Drive not authenticated. Visit /auth/google/login to authorize.');

  const drive = google.drive({ version: 'v3', auth: authClient });

  const fileMetadata = { name: fileName, parents: folderId ? [folderId] : [] };
  const media = { mimeType: 'application/zip', body: fs.createReadStream(filePath) };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, webViewLink, webContentLink'
  });

  return {
    fileId: response.data.id,
    fileName: response.data.name,
    viewLink: response.data.webViewLink,
    downloadLink: response.data.webContentLink
  };
}

// GET all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    if (!userId) return res.status(400).json({ success: false, error: 'User ID not found in token' });

    const [projects] = await pool.execute(
      `SELECT p.projectID, pd.description, pd.required_deadline, pd.deliverymode, p.status, p.order_date
       FROM project p
       JOIN project_data pd ON p.projectID = pd.projectID
       WHERE p.userID = ? 
       ORDER BY p.projectID DESC`,
      [userId]
    );

    res.json({ success: true, projects });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST: create project and optionally upload zip to personal Drive
router.post('/', authenticateToken, upload.single('zipFile'), async (req, res) => {
  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    const { description, required_deadline, deliverymode } = req.body;

    if (!userId) return res.status(400).json({ success: false, error: 'User ID not found in token' });
    if (!description || !required_deadline || !deliverymode) return res.status(400).json({ success: false, error: 'All fields are required' });

    const orderDate = new Date().toISOString().split('T')[0];
    const [projectResult] = await pool.execute(
      `INSERT INTO project (status, userID, order_date) VALUES (?, ?, ?)`,
      ['ongoing', userId, orderDate]
    );
    const projectID = projectResult.insertId;

    await pool.execute(
      `INSERT INTO project_data (projectID, description, required_deadline, deliverymode)
       VALUES (?, ?, ?, ?)`,
      [projectID, description, required_deadline, deliverymode]
    );

    let fileInfo = null;

    if (req.file) {
      try {
        // Folder ID in Drive where files will be stored (set in env)
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || null;

        const driveInfo = await uploadToGoogleDriveWithOAuth(
          req.file.path,
          req.file.originalname,
          folderId
        );

        const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2);

        await pool.execute(
          `INSERT INTO project_documentation_files 
            (projectID, original_name, file_sizeMB, uploaded_at, drive_file_id, drive_view_link) 
           VALUES (?, ?, ?, NOW(), ?, ?)`,
          [projectID, req.file.originalname, fileSizeMB, driveInfo.fileId, driveInfo.viewLink]
        );

        fileInfo = { fileName: req.file.originalname, fileSize: fileSizeMB, driveLink: driveInfo.viewLink };
      } catch (fileError) {
        console.error('❌ Error processing uploaded file:', fileError);
        // proceed without failing the whole request
      } finally {
        // cleanup temp file
        if (req.file?.path) {
          fs.unlink(req.file.path, (err) => { if (err) console.error('Error deleting temp file:', err); });
        }
      }
    }

    res.json({
      success: true,
      message: 'Project booked successfully!' + (req.file ? ' File processed.' : ''),
      projectID,
      fileInfo
    });

  } catch (error) {
    console.error('❌ Error booking project:', error);
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
