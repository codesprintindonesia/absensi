// utils/logger.utils.js
// Simple logger utility untuk aplikasi

const logger = {
  info: (message, metadata = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...metadata,
    }));
  },

  warn: (message, metadata = {}) => {
    console.warn(JSON.stringify({
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...metadata,
    }));
  },

  error: (message, metadata = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      ...metadata,
    }));
  },

  debug: (message, metadata = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(JSON.stringify({
        level: 'debug',
        timestamp: new Date().toISOString(),
        message,
        ...metadata,
      }));
    }
  },
};

export default logger;
