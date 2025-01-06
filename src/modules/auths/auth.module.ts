import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, KakaoStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
