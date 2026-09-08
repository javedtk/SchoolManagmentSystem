require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    name: process.env.DB_NAME || 'schldbdev001',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    dialect: process.env.DB_DIALECT || 'mysql'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_school_jwt_token_2026_key',
    expiry: process.env.JWT_EXPIRY || '1d'
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || 'junednite@gmail.com',
    password: process.env.EMAIL_APP_PASSWORD || 'dhbl vllw bvjl sqnf',
    secure: process.env.EMAIL_SECURE === 'true'
  },
  uploadDir: process.env.UPLOAD_DIR || 'uploads'
};
