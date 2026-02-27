import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '../base-http.exception';

export class BadRequestException extends BaseHttpException {
  constructor(errorCode: string, message: string) {
    super(errorCode, message, HttpStatus.BAD_REQUEST);
  }
}
