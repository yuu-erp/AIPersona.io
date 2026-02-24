import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from 'src/exceptions';

export class ValidatorException extends BaseHttpException {
  constructor(message: string) {
    super('BAD_REQUEST', message, HttpStatus.BAD_REQUEST);
  }
}
