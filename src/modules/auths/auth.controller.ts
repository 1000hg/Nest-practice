import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExtractJwt } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';
import { join } from 'path';
import * as fs from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    return { accessToken, refreshToken };
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const userId = req.user.userId;
    await this.authService.logout(userId);
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Access Token 재발급' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(@Req() req: any) {
    const { userId } = req.user;
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const accessToken = await this.authService.refreshAccessToken(
      userId,
      refreshToken,
    );
    return { accessToken };
  }

  @Get('req-verify-email')
  @ApiOperation({ summary: '이메일 인증 요청' })
  async reqVerifyEmail(@Query('email') email: string): Promise<void> {
    await this.authService.reqVerifyEmail(email);
  }

  @Get('res-verify-email')
  @ApiOperation({ summary: '이메일 인증 응답' })
  @UseGuards(AuthGuard('jwt-mail'))
  async verifyEmail(@Query('email') email: string): Promise<string> {
    await this.authService.resVerifyEmail(email);
    return '이메일 인증이 완료되었습니다.';
  }

  @Get('google')
  @ApiOperation({ summary: '구글 로그인' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @ApiOperation({ summary: '구글 로그인 리다이렉트' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const tokens = await this.authService.googleLogin(req.user);
    const htmlFilePath = join(
      __dirname,
      '../',
      '../',
      '../',
      'public',
      'redirect',
      'google-redirect.html',
    );

    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

    htmlContent = htmlContent.replace('{{ accessToken }}', tokens.accessToken);
    htmlContent = htmlContent.replace(
      '{{ refreshToken }}',
      tokens.refreshToken,
    );

    res.send(htmlContent);
  }
}
