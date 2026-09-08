const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authMiddleware = (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Token missing or invalid.' });
    }

    const decoded = jwt.verify(token, env.jwt.secret);
    
    // Attach user payload to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication failed. Token has expired.' });
    }
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

module.exports = authMiddleware;
