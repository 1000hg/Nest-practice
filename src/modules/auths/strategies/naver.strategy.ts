import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { SocialUser } from '../interface/auth.interface';
import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      authorizationURL: 'https://nid.naver.com/oauth2.0/authorize',
      tokenURL: 'https://nid.naver.com/oauth2.0/token',
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_REDIRECT_URI,
    });
  }

  async validate(accessToken: string): Promise<SocialUser> {
    const { data } = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const profile = data.response;

    return {
      provider: 'naver',
      providerId: profile.id,
      email: profile.email,
      nickname: profile.nickname,
      profileImage: profile.profile_image,
    };
  }
}
