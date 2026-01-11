import { getErrorReports } from './errorReporter';
import { getHealthSnapshot } from './healthConsole';
import { getLogs } from './logger';

export const buildDiagnosticsBundle = ({ maxLogs = 120, maxErrors = 50 } = {}) => {
  const snapshot = getHealthSnapshot();
  const logs = getLogs();
  const errors = getErrorReports();

  return {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    snapshot,
    logs: Array.isArray(logs) ? logs.slice(0, maxLogs) : [],
    errors: Array.isArray(errors) ? errors.slice(0, maxErrors) : [],
  };
};
