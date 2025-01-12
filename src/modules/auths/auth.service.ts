import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'modules/users/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'modules/tokens/token.service';
import { RefreshTokenRepository } from 'modules/tokens/refresh-token.repository';
import { UpdateUserDto } from 'modules/users/dto/update-user.dto';
import { MailService } from 'mail/mail.service';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from 'modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RandomUtil } from 'util/random.util';
import { UserUtil } from 'util/user.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly mailService: MailService,
    private readonly randomUtil: RandomUtil,
    private readonly userUtil: UserUtil,
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

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    if (this.userService.readById(userId)) {
      this.refreshTokenRepository.deleteToken(userId);
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

  async googleLogin(userInfo: any) {
    let user = await this.userRepository.findOne({
      where: {
        email: userInfo.email,
        provider: 'google',
      },
    });

    if (!user) {
      let createUserDto = new CreateUserDto();
      createUserDto.email = userInfo.email;
      createUserDto.password = this.randomUtil.GenerateRandomValue(15);
      createUserDto.name = userInfo.name;
      do {
        createUserDto.nickname = this.randomUtil.GenerateRandomValue(10);
      } while (await this.userUtil.isNicknameTaken(createUserDto.nickname));

      createUserDto.role = 'user';
      createUserDto.login_type = 'social';
      createUserDto.provider = 'google';
      createUserDto.is_email_verified = true;

      user = await this.userService.createInfo(createUserDto);
    }

    const accessToken = await this.tokenService.createAccessToken(
      user.id,
      user.email,
    );
    const refreshToken = await this.tokenService.createRefreshToken(
      user.id,
      user.email,
    );

    return { accessToken, refreshToken };
  }
}
