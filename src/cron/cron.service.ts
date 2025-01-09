import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BackupService } from 'backup/backup.service';
import { RefreshTokenRepository } from 'modules/token/refresh-token.repository';

@Injectable()
export default class CronService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly backupService: BackupService,
  ) {}

  @Cron('0 0 0 * * *')
  async handleDeleteExpiredTokens() {
    console.log('만료 토큰 제거');
    await this.refreshTokenRepository.deleteExpiredTokens();
  }

  @Cron('0 0 0 * * *')
  async handleAnotherTask() {
    console.log('db 백업 완료');
    await this.backupService.backupMySQLDatabase();
  }
}
