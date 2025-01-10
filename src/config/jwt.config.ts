import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,

  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,

  mailSecret: process.env.JWT_MAIL_SECRET,
  mailExpiresIn: process.env.JWT_MAIL_EXPIRATION_TIME,
}));
