import { Controller, Post } from '@nestjs/common';
import { BackupService } from './backup.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('/')
  @ApiOperation({ summary: 'db 백업' })
  async manualBackup() {
    await this.backupService.backupMySQLDatabase();
    return { message: 'Backup completed successfully' };
  }
}
