import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  SERVER_URL: process.env.SERVER_URL,
}));
