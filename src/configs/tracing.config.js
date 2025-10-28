import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import chalk from 'chalk';

const initializeTracing = () => {
  if (process.env.SIGNOZ_ENABLED !== 'true') {
    console.log(chalk.gray('ℹ️  Signoz tracing is disabled'));
    return null;
  }

  if (!process.env.SIGNOZ_OTLP_ENDPOINT) {
    console.error(chalk.red('❌ SIGNOZ_OTLP_ENDPOINT is required when SIGNOZ_ENABLED=true'));
    return null;
  }

  try {
    const traceExporter = new OTLPTraceExporter({
      url: `${process.env.SIGNOZ_OTLP_ENDPOINT}/v1/traces`,
    });

    const metricExporter = new OTLPMetricExporter({
      url: `${process.env.SIGNOZ_OTLP_ENDPOINT}/v1/metrics`,
    });

    const metricReader = new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 60000,
    });

    const instrumentations = getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-net': { enabled: false },
    });

    const sdk = new NodeSDK({
      traceExporter,
      metricReader,
      instrumentations,
      serviceName: process.env.SIGNOZ_SERVICE_NAME || 'absensi-msdm',
    });

    sdk.start();
    
    console.log(chalk.green('✅ Signoz tracing initialized'));
    console.log(chalk.blue(`📊 Endpoint: ${process.env.SIGNOZ_OTLP_ENDPOINT}`));

    process.on('SIGTERM', () => sdk.shutdown());
    process.on('SIGINT', () => sdk.shutdown());

    return sdk;
  } catch (error) {
    console.error(chalk.red('❌ Failed to initialize Signoz:'), error.message);
    return null;
  }
};

export { initializeTracing };