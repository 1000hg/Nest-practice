import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
}));
