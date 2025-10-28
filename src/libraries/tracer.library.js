/**
 * Custom Tracer Library
 * Provides helper functions for manual instrumentation
 * Following Bank Sultra Coding Guidelines
 */

import { trace, context, SpanStatusCode } from '@opentelemetry/api';

/**
 * Get tracer instance
 * @returns {Tracer}
 */
const getTracer = () => {
  return trace.getTracer('absensi-msdm', '1.0.0');
};

/**
 * Create a span for a function
 * @param {string} spanName - Name of the span
 * @param {Object} attributes - Additional attributes
 * @param {Function} fn - Function to execute within span
 * @returns {Promise<any>}
 */
const withSpan = async (spanName, attributes = {}, fn) => {
  const tracer = getTracer();
  
  return tracer.startActiveSpan(spanName, async (span) => {
    try {
      // Add custom attributes
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });

      // Execute function
      const result = await fn(span);
      
      // Set success status
      span.setStatus({ code: SpanStatusCode.OK });
      
      return result;
    } catch (error) {
      // Record error
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      
      throw error;
    } finally {
      span.end();
    }
  });
};

/**
 * Add event to current span
 * @param {string} eventName - Name of the event
 * @param {Object} attributes - Event attributes
 */
const addEvent = (eventName, attributes = {}) => {
  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(eventName, attributes);
  }
};

/**
 * Add attribute to current span
 * @param {string} key - Attribute key
 * @param {any} value - Attribute value
 */
const setAttribute = (key, value) => {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute(key, value);
  }
};

/**
 * Record exception in current span
 * @param {Error} error - Error object
 */
const recordException = (error) => {
  const span = trace.getActiveSpan();
  if (span) {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
  }
};

export {
  getTracer,
  withSpan,
  addEvent,
  setAttribute,
  recordException
};