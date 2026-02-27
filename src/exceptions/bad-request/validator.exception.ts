import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '../base-http.exception';

export class ValidatorException extends BaseHttpException {
  constructor(message: string) {
    super('BAD_REQUEST', message, HttpStatus.BAD_REQUEST);
  }
}
