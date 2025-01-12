import { Module } from '@nestjs/common';
import { RandomUtil } from './random.util';
import { UserUtil } from './user.util';
import { User } from 'modules/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RandomUtil, UserUtil],
  exports: [RandomUtil, UserUtil],
})
export class UtilModule {}
