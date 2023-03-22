import { HttpStatus } from './http-status';

export class HttpException extends Error {
  constructor(
    message: string,
    readonly responseBody: string | object | [],
    readonly responseStatus: HttpStatus,
  ) {
    super(message);
  }
}

export class ValidationException extends HttpException {
  constructor(readonly responseBody: string | object | []) {
    super('Validation error', responseBody, HttpStatus.BAD_REQUEST);
  }
}

export class BadRequestException extends HttpException {
  constructor(readonly responseBody: string | object | []) {
    super('Bad request', responseBody, HttpStatus.BAD_REQUEST);
  }
}
