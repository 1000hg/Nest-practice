import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UtilModule } from 'util/utill.module';
import { FrontController } from './front.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', '../', 'public'),
      serveRoot: '/',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', '../', 'public', 'page'),
      serveRoot: '/page',
    }),

    UtilModule,
  ],
  controllers: [FrontController],
})
export class FrontModule {}
