import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_FROM,
}));
