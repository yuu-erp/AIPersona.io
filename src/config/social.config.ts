import { registerAs } from '@nestjs/config';

export default registerAs('social', () => ({
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
  },
  facebook: {
    clientId: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
  },
}));
