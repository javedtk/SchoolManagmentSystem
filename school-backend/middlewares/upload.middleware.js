const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

const uploadDir = path.join(__dirname, '..', env.uploadDir);

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Subdirectories for organization
const subDirs = ['resumes', 'images', 'attachments'];
subDirs.forEach(sub => {
  const subPath = path.join(uploadDir, sub);
  if (!fs.existsSync(subPath)) {
    fs.mkdirSync(subPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Select directory based on file type or fieldname
    let subFolder = 'attachments';
    if (file.fieldname === 'resume') {
      subFolder = 'resumes';
    } else if (
      file.fieldname === 'profile_image' ||
      file.fieldname === 'image' ||
      (file.fieldname !== 'file' && file.fieldname !== 'attachment' && file.mimetype.startsWith('image/'))
    ) {
      subFolder = 'images';
    }
    cb(null, path.join(uploadDir, subFolder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  // Allow common file types
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.mp4'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Allowed: ' + allowedExtensions.join(', ')), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;
