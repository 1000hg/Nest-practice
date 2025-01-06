import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { UserModule } from 'modules/users/user.module';
import * as path from 'path';
import * as fs from 'fs';
import { BackupModule } from 'backup/backup.module';
import { AuthModule } from 'modules/auths/auth.module';

/** 엔티티 동적 수집 */
function collectEntities(): string[] {
  const baseDir = path.resolve(__dirname, 'modules');
  const entityPaths: string[] = [];

  const modules = fs.readdirSync(baseDir).filter((folder) => {
    const modulePath = path.join(baseDir, folder, 'entities');
    return fs.existsSync(modulePath) && fs.lstatSync(modulePath).isDirectory();
  });

  modules.forEach((module) => {
    const entitiesDir = path.join(baseDir, module, 'entities');

    const entityFiles = fs
      .readdirSync(entitiesDir)
      .filter((file) => file.match(/\.entity\.(ts|js)$/));

    entityFiles.forEach((file) => {
      entityPaths.push(path.join(entitiesDir, file));
    });
  });

  return entityPaths;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
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
        entities: collectEntities(),
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),

    UserModule,
    BackupModule,
    AuthModule,
  ],
})
export class AppModule {}
