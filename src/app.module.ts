import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'modules/users/user.module';
import { BackupModule } from 'backup/backup.module';
import { AuthModule } from 'modules/auths/auth.module';
import config from './config/index';
import { FileLogger } from 'log/file-logger';
import { CronModule } from 'cron/cron.module';
import { FrontModule } from 'front/front.module';
import { BoardModule } from 'modules/boards/board.module';
import { FileModule } from 'modules/files/file.module';
import { CategoryModule } from 'modules/categories/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/modules/**/*.entity.{ts,js}'],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        logger: new FileLogger(),
      }),
      inject: [ConfigService],
    }),

    FrontModule,
    UserModule,
    BackupModule,
    AuthModule,
    BoardModule,
    CronModule,
    FileModule,
    CategoryModule,
  ],
})
export class AppModule {}
