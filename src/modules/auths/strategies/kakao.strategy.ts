import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { SocialUser } from '../interface/auth.interface';
import axios from 'axios';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      authorizationURL: 'https://kauth.kakao.com/oauth/authorize',
      tokenURL: 'https://kauth.kakao.com/oauth/token',
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
      callbackURL: process.env.KAKAO_REDIRECT_URI,
    });
  }

  async validate(accessToken: string): Promise<SocialUser> {
    const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      provider: 'kakao',
      providerId: data.id,
      email: data.kakao_account?.email,
      nickname: data.properties?.nickname,
      profileImage: data.properties?.profile_image,
    };
  }
}
