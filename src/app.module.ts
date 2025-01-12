import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'modules/users/user.module';
import { BackupModule } from 'backup/backup.module';
import { AuthModule } from 'modules/auths/auth.module';
import config from './config/index';
import { FileLogger } from 'log/file-logger';
import { CronModule } from 'cron/cron.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),

    UserModule,
    BackupModule,
    AuthModule,
    CronModule,
  ],
})
export class AppModule {}
