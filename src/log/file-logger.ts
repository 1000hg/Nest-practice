import { Logger } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class FileLogger implements Logger {
  private logFilePath: string;
  private maxFileSize: number;
  private maxRetentionDays: number;

  constructor(maxFileSize = 5 * 1024 * 1024, maxRetentionDays = 7) {
    this.logFilePath = path.join(__dirname, 'typeorm.log');
    this.maxFileSize = maxFileSize;
    this.maxRetentionDays = maxRetentionDays;

    this.cleanupOldLogs();
  }

  logQuery(query: string, parameters?: any[]) {
    this.writeLog('QUERY', query, parameters);
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.writeLog('QUERY ERROR', query, parameters, error);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.writeLog('SLOW QUERY', query, parameters, `Execution time: ${time}ms`);
  }

  logSchemaBuild(message: string) {
    this.writeLog('SCHEMA BUILD', message);
  }

  logMigration(message: string) {
    this.writeLog('MIGRATION', message);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    this.writeLog(level.toUpperCase(), message);
  }

  private writeLog(
    type: string,
    message: string,
    parameters?: any[],
    error?: any,
  ) {
    const logMessage = `[${new Date().toISOString()}] [${type}] ${
      error ? `[Error: ${error}]` : ''
    } ${message} ${parameters ? `Parameters: ${JSON.stringify(parameters)}` : ''}\n`;

    this.checkFileSize();
    fs.appendFileSync(this.logFilePath, logMessage, { encoding: 'utf8' });
  }

  private checkFileSize() {
    try {
      const stats = fs.statSync(this.logFilePath);
      if (stats.size > this.maxFileSize) {
        const rolledFilePath = `${this.logFilePath}.${Date.now()}`;
        fs.renameSync(this.logFilePath, rolledFilePath);
        console.log(`Rolled log file to: ${rolledFilePath}`);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Error checking log file size:', err);
      }
    }
  }

  private cleanupOldLogs() {
    const logDir = path.dirname(this.logFilePath);
    const files = fs.readdirSync(logDir);
    const now = Date.now();

    files.forEach((file) => {
      const filePath = path.join(logDir, file);
      if (file.startsWith('typeorm.log.') || file === 'typeorm.log') {
        try {
          const stats = fs.statSync(filePath);
          const ageInDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

          if (ageInDays > this.maxRetentionDays) {
            fs.unlinkSync(filePath);
            console.log(`Deleted old log file: ${filePath}`);
          }
        } catch (err) {
          console.error('Error cleaning up log file:', err);
        }
      }
    });
  }
}
