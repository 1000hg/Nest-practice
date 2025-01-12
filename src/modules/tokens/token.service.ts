import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository } from './refresh-token.repository';
import * as ms from 'ms';

@Injectable()
export class TokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  async createRefreshToken(user_id: number, email: string): Promise<string> {
    const payload = { sub: user_id, email };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });

    const expiresAt = new Date();
    const expiration = this.configService.get('JWT_REFRESH_EXPIRATION_TIME');

    const millisecondsToAdd = ms(expiration);
    expiresAt.setTime(expiresAt.getTime() + millisecondsToAdd);

    await this.refreshTokenRepository.saveToken(
      user_id,
      refreshToken,
      expiresAt,
    );

    return refreshToken;
  }

  async validateRefreshToken(user_id: number, token: string): Promise<boolean> {
    const storedToken =
      await this.refreshTokenRepository.readTokenByUserId(user_id);
    if (!storedToken) {
      return false;
    }

    return storedToken.token === token;
  }

  async deleteRefreshToken(user_id: number): Promise<void> {
    await this.refreshTokenRepository.deleteToken(user_id);
  }
}
