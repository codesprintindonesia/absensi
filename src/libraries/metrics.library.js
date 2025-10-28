/**
 * Custom Metrics Library
 * Provides helper functions for business metrics
 * Following Bank Sultra Coding Guidelines
 */

import { metrics } from '@opentelemetry/api';

// Get meter instance
const meter = metrics.getMeter('absensi-msdm', '1.0.0');

// ================================================================
// COUNTERS - Track counts that only go up
// ================================================================

const absensiCreatedCounter = meter.createCounter('absensi.created', {
  description: 'Number of absensi records created',
  unit: '1',
});

const absensiErrorCounter = meter.createCounter('absensi.errors', {
  description: 'Number of errors in absensi processing',
  unit: '1',
});

const rekonsiliasiExecutedCounter = meter.createCounter('rekonsiliasi.executed', {
  description: 'Number of reconciliation processes executed',
  unit: '1',
});

// ================================================================
// HISTOGRAMS - Track distributions
// ================================================================

const rekonsiliasiDurationHistogram = meter.createHistogram('rekonsiliasi.duration', {
  description: 'Duration of reconciliation process',
  unit: 'ms',
});

const databaseQueryDurationHistogram = meter.createHistogram('database.query.duration', {
  description: 'Duration of database queries',
  unit: 'ms',
});

// ================================================================
// UP/DOWN COUNTERS - Can go up and down
// ================================================================

const activePegawaiGauge = meter.createUpDownCounter('pegawai.active', {
  description: 'Number of active employees',
  unit: '1',
});

// ================================================================
// HELPER FUNCTIONS
// ================================================================

/**
 * Record absensi creation
 * @param {string} status - Status kehadiran
 * @param {string} pegawaiId - ID pegawai
 */
const recordAbsensiCreated = (status, pegawaiId) => {
  absensiCreatedCounter.add(1, {
    status,
    pegawai_id: pegawaiId,
  });
};

/**
 * Record absensi error
 * @param {string} errorType - Type of error
 * @param {string} operation - Operation that failed
 */
const recordAbsensiError = (errorType, operation) => {
  absensiErrorCounter.add(1, {
    error_type: errorType,
    operation,
  });
};

/**
 * Record rekonsiliasi execution
 * @param {number} duration - Duration in milliseconds
 * @param {number} processedCount - Number of records processed
 * @param {boolean} success - Whether successful
 */
const recordRekonsiliasiExecution = (duration, processedCount, success) => {
  rekonsiliasiExecutedCounter.add(1, {
    success: success.toString(),
  });
  
  rekonsiliasiDurationHistogram.record(duration, {
    success: success.toString(),
    processed_count: processedCount.toString(),
  });
};

/**
 * Record database query duration
 * @param {number} duration - Duration in milliseconds
 * @param {string} operation - Type of query (SELECT, INSERT, UPDATE, DELETE)
 * @param {string} table - Table name
 */
const recordDatabaseQuery = (duration, operation, table) => {
  databaseQueryDurationHistogram.record(duration, {
    operation,
    table,
  });
};

/**
 * Update active pegawai count
 * @param {number} delta - Change in count (+1 or -1)
 */
const updateActivePegawai = (delta) => {
  activePegawaiGauge.add(delta);
};

export {
  recordAbsensiCreated,
  recordAbsensiError,
  recordRekonsiliasiExecution,
  recordDatabaseQuery,
  updateActivePegawai
};