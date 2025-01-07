import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'modules/users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly refreshTokens: Map<Number, string> = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.readByEmail(email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const accessToken = await this.createAccessToken(user.id, user.email);
    const refreshToken = await this.createRefreshToken(user.id, user.email);

    this.refreshTokens.set(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: Number) {
    if (this.refreshTokens.has(userId)) {
      this.refreshTokens.delete(userId);
    }
    return { message: '로그아웃 성공' };
  }

  async refreshAccessToken(
    userId: Number,
    refreshToken: string,
  ): Promise<string> {
    const storedRefreshToken = this.refreshTokens.get(userId);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.createAccessToken(payload.sub, payload.email);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }
  }

  private async createAccessToken(
    userId: Number,
    email: string,
  ): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  private async createRefreshToken(
    userId: Number,
    email: string,
  ): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }
}
