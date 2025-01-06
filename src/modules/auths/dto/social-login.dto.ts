export class SocialLoginDto {
  provider: 'kakao' | 'google' | 'naver';
  accessToken: string;
}
