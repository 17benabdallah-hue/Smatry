export interface ErrorLogEntry {
  timestamp: string;
  type: string;
  message: string;
  stack?: string;
}

export interface ErrorStats {
  [key: string]: number | string;
  last_error_time: number;
}

const LOG_STORAGE_KEY = 'smart_reminder_error_logs';
const STATS_STORAGE_KEY = 'smart_reminder_error_stats';
const MAX_LOGS = 50;

export const ErrorLogger = {
  log(error: Error | any) {
    const throwable = error instanceof Error ? error : new Error(String(error));
    console.error('❌ خطأ:', throwable.message, throwable);
    this.saveToStorage(throwable);
    this.updateErrorStats(throwable);
  },

  saveToStorage(throwable: Error) {
    try {
      const logs: ErrorLogEntry[] = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
      const newEntry: ErrorLogEntry = {
        timestamp: new Date().toISOString(),
        type: throwable.name || 'Error',
        message: throwable.message,
        stack: throwable.stack?.split('\n').slice(0, 10).join('\n'),
      };
      const updatedLogs = [newEntry, ...logs].slice(0, MAX_LOGS);
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
      console.error('فشل حفظ الخطأ في التخزين المحلي', e);
    }
  },

  updateErrorStats(throwable: Error) {
    try {
      const stats: ErrorStats = JSON.parse(localStorage.getItem(STATS_STORAGE_KEY) || '{"last_error_time":0}');
      const errorType = throwable.name || 'Error';
      const currentCount = (stats[errorType] as number) || 0;
      stats[errorType] = currentCount + 1;
      stats.last_error_time = Date.now();
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('فشل تحديث إحصائيات الأخطاء', e);
    }
  },

  getErrorStats(): ErrorStats {
    try {
      return JSON.parse(localStorage.getItem(STATS_STORAGE_KEY) || '{"last_error_time":0}');
    } catch (e) {
      return { last_error_time: 0 };
    }
  },

  getLogs(): ErrorLogEntry[] {
    try {
      return JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  clearLogs() {
    localStorage.removeItem(LOG_STORAGE_KEY);
    localStorage.removeItem(STATS_STORAGE_KEY);
  }
};
