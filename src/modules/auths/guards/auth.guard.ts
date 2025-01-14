import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies;

    if (!cookies || !cookies.accessToken) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(cookies.accessToken);
      request.user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }
}
