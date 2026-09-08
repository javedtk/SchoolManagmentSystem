const errorMiddleware = (err, req, res, next) => {
  console.error('API Error:', err.message, err.stack);

  let status = err.status || 500;
  let message = err.message || 'An unexpected internal server error occurred.';

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    message = err.errors && err.errors.length > 0 
      ? err.errors.map(e => e.message).join(', ') 
      : err.message;
  }

  res.status(status).json({
    status,
    message,
    errors: err.errors || null,
    // only expose stack traces in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorMiddleware;
