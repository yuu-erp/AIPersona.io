import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  engineUrl: process.env.AI_ENGINE_URL,
  apiKey: process.env.AI_API_KEY,
  storage: {
    bucket: process.env.S3_STORAGE_BUCKET,
    region: process.env.S3_STORAGE_REGION,
  },
}));
