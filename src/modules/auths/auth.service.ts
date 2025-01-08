import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'modules/users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'modules/token/token.service';

@Injectable()
export class AuthService {
  private readonly refreshTokens: Map<Number, string> = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
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

    const accessToken = await this.tokenService.createAccessToken(
      user.id,
      email,
    );
    const refreshToken = await this.tokenService.createRefreshToken(
      user.id,
      email,
    );

    this.refreshTokens.set(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    if (this.refreshTokens.has(userId)) {
      this.refreshTokens.delete(userId);
    }
    return { message: '로그아웃 성공' };
  }

  async refreshAccessToken(
    userId: number,
    refreshToken: string,
  ): Promise<string> {
    const storedRefreshToken = this.refreshTokens.get(userId);

    console.log(storedRefreshToken, refreshToken);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.tokenService.createRefreshToken(payload.sub, payload.email);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }
  }
}
