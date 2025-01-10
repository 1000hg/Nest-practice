import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'modules/users/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'modules/tokens/token.service';
import { RefreshTokenRepository } from 'modules/tokens/refresh-token.repository';
import { UpdateUserDto } from 'modules/users/dto/update-user.dto';
import { MailService } from 'mail/mail.service';

@Injectable()
export class AuthService {
  private readonly refreshTokens: Map<Number, string> = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly mailService: MailService,
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
      this.refreshTokenRepository.deleteToken(userId);
      this.refreshTokens.delete(userId);
    }
    return { message: '로그아웃 성공' };
  }

  async refreshAccessToken(
    userId: number,
    refreshToken: string,
  ): Promise<string> {
    const isValid = await this.tokenService.validateRefreshToken(
      userId,
      refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }

    const user = await this.userService.readById(userId);

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    return this.tokenService.createAccessToken(user.id, user.email);
  }

  async reqVerifyEmail(email: string): Promise<void> {
    const user = await this.userService.readByEmail(email);

    await this.mailService.sendVerificationEmail(user);
  }

  async resVerifyEmail(email: string): Promise<void> {
    const user = await this.userService.readByEmail(email);

    let updateUserDto: UpdateUserDto = new UpdateUserDto();
    updateUserDto.is_email_verified = true;

    this.userService.updateInfo(user.id, updateUserDto);
  }

  async googleLogin(user: any) {
    if (!user) {
      return 'No user from Google';
    }

    return {
      message: 'User information from Google',
      user,
    };
  }
}
