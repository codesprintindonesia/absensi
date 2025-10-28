import { trace } from '@opentelemetry/api';

const log = (level, message, data = {}) => {
  // Console log tetap ada
  console.log(`[${level.toUpperCase()}] ${message}`, data);
  
  // Tambahkan ke span jika tracing enabled
  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(message, {
      level,
      ...Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {})
    });
  }
};

const logger = {
  info: (message, data) => log('info', message, data),
  warn: (message, data) => log('warn', message, data),
  error: (message, data) => log('error', message, data),
  debug: (message, data) => log('debug', message, data),
};

export { logger };