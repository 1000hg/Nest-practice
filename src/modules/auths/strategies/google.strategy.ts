import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL:
        configService.get('SERVER_URL') +
        configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });
  }

  async validate(accessToken: string, profile: any): Promise<any> {
    if (!profile) {
      const userProfile = await this.fetchGoogleUserProfile(accessToken);
      profile = userProfile;
    }

    return {
      email: profile.email,
      name: profile.name,
      accessToken,
    };
  }

  private async fetchGoogleUserProfile(accessToken: string): Promise<Profile> {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch Google user profile');
    }
    return response.json();
  }
}
