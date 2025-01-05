import { Controller, Post } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('/')
  async manualBackup() {
    await this.backupService.backupMySQLDatabase();
    return { message: 'Backup completed successfully' };
  }
}
