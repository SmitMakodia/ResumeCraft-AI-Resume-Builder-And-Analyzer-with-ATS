import { isDbConnected } from '../config/db.js';

// Rejects DB-dependent requests up front so they fail in milliseconds with a clear reason
// instead of waiting out Mongo's server-selection timeout.
export const requireDb = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      message: 'Database temporarily unavailable. Please try again shortly.'
    });
  }
  next();
};

export const notFound = (req, res) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
};

// Express 5 forwards rejected async handlers here automatically.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  console.error(`[error] ${req.method} ${req.originalUrl} -> ${status}:`, err.message);

  // Multer surfaces oversize uploads and the PDF/image mime filter as plain errors.
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large. Maximum size is 20MB.' });
  }
  if (err.message === 'Only PDF and image files are allowed!') {
    return res.status(415).json({ message: err.message });
  }

  res.status(status).json({
    message: status === 500 ? 'Internal server error' : err.message,
    // Stack traces and driver internals stay server-side unless explicitly developing.
    ...(process.env.NODE_ENV === 'development' && { detail: err.message })
  });
};
