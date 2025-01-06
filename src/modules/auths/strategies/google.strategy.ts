import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { SocialUser } from '../interface/auth.interface';
import { Strategy } from 'passport-local';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
      tokenURL: 'https://oauth2.googleapis.com/token',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    });
  }

  async validate(accessToken: string): Promise<SocialUser> {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return {
      provider: 'google',
      providerId: data.id,
      email: data.email,
      nickname: data.name,
      profileImage: data.picture,
    };
  }
}
