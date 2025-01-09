import { Module } from '@nestjs/common';
import CronService from './cron.service';
import { TokenModule } from 'modules/token/token.module';
import { BackupModule } from 'backup/backup.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), TokenModule, BackupModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
