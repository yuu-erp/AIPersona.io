import { wait } from './wait';
import { AppLoggerService } from 'src/services/logger';

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number,
  logger: AppLoggerService,
) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await fn();
      return;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      logger.error(`🚀 ~ retry attempt ${i} failed:`, error);
      if (i === retries) {
        throw error;
      }
      await wait(delay);
    }
  }
};
