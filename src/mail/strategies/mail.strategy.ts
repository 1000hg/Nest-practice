import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class MailStrategy extends PassportStrategy(Strategy, 'jwt-mail') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        return req.query.token;
      },
      secretOrKey: configService.get('JWT_MAIL_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
