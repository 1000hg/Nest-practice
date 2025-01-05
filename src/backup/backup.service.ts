import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BackupService {
  constructor(private readonly dataSource: DataSource) {}

  async backupMySQLDatabase() {
    const options = this.dataSource.options;
    let host: string;
    let username: string;
    let password: string;
    let database: string;

    if (options.type === 'mysql') {
      host = options.host;
      username = options.username;
      password = options.password;
      database = options.database;
    } else if (options.type === 'sqlite') {
      database = options.database;
    } else {
      throw new Error('Unsupported database type');
    }

    const now = new Date();
    const timestamp =
      `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_` +
      `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

    const backupDir = path.join(__dirname, 'bin');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFileName = `${database}_backup_${timestamp}.sql`;
    const backupFilePath = path.join(backupDir, backupFileName);

    const mysqldumpPath = 'mysqldump';

    const commandArgs = ['-h', host, '-u', username, '-p' + password, database];

    try {
      const result = spawnSync(mysqldumpPath, commandArgs, {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      if (result.error) {
        console.error('Error during backup:', result.error);
        return;
      }

      const output = fs.createWriteStream(backupFilePath);
      output.write(result.stdout);
      output.end();

      console.log(
        `Backup completed successfully! File saved at: ${backupFilePath}`,
      );
    } catch (error) {
      console.error('Backup failed:', error);
    }
  }
}
