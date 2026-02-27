import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService implements LoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  /**
   * Thiết lập context cho logger (thường là tên Class)
   */
  setContext(context: string): void {
    this.context = context;
  }

  log(message: unknown, context?: string) {
    this.logger.log(message, context || this.context);
  }

  error(message: unknown, stack?: string, context?: string) {
    this.logger.error(message, stack, context || this.context);
  }

  warn(message: unknown, context?: string) {
    this.logger.warn(message, context || this.context);
  }

  debug(message: unknown, context?: string) {
    if (this.logger.debug) {
      this.logger.debug(message, context || this.context);
    }
  }

  verbose(message: unknown, context?: string) {
    if (this.logger.verbose) {
      this.logger.verbose(message, context || this.context);
    }
  }
}
