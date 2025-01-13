import { Module } from '@nestjs/common';
import { RandomUtil } from './random.util';
import { UserUtil } from './user.util';
import { User } from 'modules/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathUtil } from './path.util';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RandomUtil, UserUtil, PathUtil],
  exports: [RandomUtil, UserUtil, PathUtil],
})
export class UtilModule {}
