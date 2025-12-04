// // routes/userend/userBook.js
// import express from 'express';
// import pool from '../../db.js';
// import { authenticateToken } from '../middleware/middleware.js';

// const router = express.Router();

// // GET all projects for the logged-in user
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
//     if (!userId) {
//       return res.status(400).json({ success: false, error: 'User ID not found in token' });
//     }

//     const [projects] = await pool.execute(
//       `SELECT p.projectID, pd.description, pd.required_deadline, pd.deliverymode, 
//               p.status, p.order_date
//        FROM project p
//        JOIN project_data pd ON p.projectID = pd.projectID
//        WHERE p.userID = ? 
//        ORDER BY p.projectID DESC`,
//       [userId]
//     );

//     res.json({ success: true, projects });
//   } catch (error) {
//     console.error('❌ Error fetching projects:', error);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// });

// // POST a new project booking
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
//     const { description, required_deadline, deliverymode } = req.body;

//     if (!userId) {
//       return res.status(400).json({ success: false, error: 'User ID not found in token' });
//     }

//     if (!description || !required_deadline || !deliverymode) {
//       return res.status(400).json({ success: false, error: 'All fields are required' });
//     }

//     // Insert into project table (est_deadline is not set here - will be filled later)
//     const orderDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
//     const [projectResult] = await pool.execute(
//       `INSERT INTO project (status, userID, order_date) 
//        VALUES (?, ?, ?)`,
//       ['ongoing', userId, orderDate]
//     );

//     const projectID = projectResult.insertId;

//     // Insert into project_data table
//     await pool.execute(
//       `INSERT INTO project_data (projectID, description, required_deadline, deliverymode)
//        VALUES (?, ?, ?, ?)`,
//       [projectID, description, required_deadline, deliverymode]
//     );

//     res.json({ success: true, message: 'Project booked successfully!', projectID });
//   } catch (error) {
//     console.error('❌ Error booking project:', error);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// });

// export default router;

//Code with ZIP UPLOAD LOGIC IS BELOW


// routes/userend/userBook.js
import express from 'express';
import pool from '../../db.js';
import { authenticateToken } from '../middleware/middleware.js';
import multer from 'multer';
import path from 'path';
import { google } from 'googleapis';
import fs from 'fs';
import { promisify } from 'util';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only zip files
    if (path.extname(file.originalname).toLowerCase() === '.zip') {
      cb(null, true);
    } else {
      cb(new Error('Only .zip files are allowed'));
    }
  }
});

// Google Drive setup
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_DRIVE_KEY_FILE || 'credentials.json',
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

// Utility function to upload to Google Drive
async function uploadToGoogleDrive(filePath, fileName, folderId) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : []
    };

    const media = {
      mimeType: 'application/zip',
      body: fs.createReadStream(filePath)
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink'
    });

    return {
      fileId: response.data.id,
      fileName: response.data.name,
      viewLink: response.data.webViewLink,
      downloadLink: response.data.webContentLink
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

// GET all projects for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID not found in token' });
    }

    const [projects] = await pool.execute(
      `SELECT p.projectID, pd.description, pd.required_deadline, pd.deliverymode, 
              p.status, p.order_date
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

// POST a new project booking WITH optional file upload
router.post('/', authenticateToken, upload.single('zipFile'), async (req, res) => {
  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    const { description, required_deadline, deliverymode } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID not found in token' });
    }

    if (!description || !required_deadline || !deliverymode) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Insert into project table (est_deadline is not set here - will be filled later)
    const orderDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const [projectResult] = await pool.execute(
      `INSERT INTO project (status, userID, order_date) 
       VALUES (?, ?, ?)`,
      ['ongoing', userId, orderDate]
    );

    const projectID = projectResult.insertId;

    // Insert into project_data table
    await pool.execute(
      `INSERT INTO project_data (projectID, description, required_deadline, deliverymode)
       VALUES (?, ?, ?, ?)`,
      [projectID, description, required_deadline, deliverymode]
    );

    // Handle file upload if provided
    let fileInfo = null;
    if (req.file) {
      try {
        // Upload to Google Drive
        const driveInfo = await uploadToGoogleDrive(
          req.file.path,
          req.file.originalname,
          process.env.GOOGLE_DRIVE_FOLDER_ID
        );

        // Get file size in MB
        const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2);

        // Save file info to project_documentation_files table
        await pool.execute(
          `INSERT INTO project_documentation_files 
           (projectID, original_name, file_sizeMB, uploaded_at, drive_file_id, drive_view_link) 
           VALUES (?, ?, ?, NOW(), ?, ?)`,
          [projectID, req.file.originalname, fileSizeMB, driveInfo.fileId, driveInfo.viewLink]
        );

        fileInfo = {
          fileName: req.file.originalname,
          fileSize: fileSizeMB,
          driveLink: driveInfo.viewLink
        };

        // Remove the temporary file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });

      } catch (fileError) {
        console.error('❌ Error processing uploaded file:', fileError);
        // Don't fail the whole request if file upload fails
        // Just log the error and continue
      }
    }

    res.json({ 
      success: true, 
      message: 'Project booked successfully!' + (req.file ? ' File uploaded.' : ''), 
      projectID,
      fileInfo: fileInfo
    });

  } catch (error) {
    console.error('❌ Error booking project:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
    
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;