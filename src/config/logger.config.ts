import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    // Console transport
    new transports.Console({
      format: isProduction
        ? format.combine(format.timestamp(), format.json())
        : format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.ms(),
            format.colorize({ all: true }),
            format.printf((info) => {
              const { timestamp, level, message, context, ms, ...meta } = info;
              const ctx =
                typeof context === 'string' ? context : JSON.stringify(context);
              const contextStr = ctx ? ` [\x1b[33m${ctx}\x1b[0m]` : '';
              const metaStr = Object.keys(meta).length
                ? ` ${JSON.stringify(meta)}`
                : '';
              return `${String(timestamp)} ${level}${contextStr} ${String(message)} ${String(ms)}${metaStr}`;
            }),
          ),
    }),
    // File transport - Error logs
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    // File transport - Combined logs
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};
