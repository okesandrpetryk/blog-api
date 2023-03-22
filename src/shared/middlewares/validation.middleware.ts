import { RequestHandler } from 'express';
import { ZodEffects, ZodObject } from 'zod';

import { ValidationException } from '../exceptions';

export function bodyValidationMiddleware<T>(
  type: ZodObject<any> | ZodEffects<any>,
): RequestHandler {
  return (req, res, next) => {
    try {
      const data = type.parse(req.body);

      req.body = data;

      next();
    } catch (e: Error | any) {
      next(new ValidationException(e));
    }
  };
}

export function paramValidationMiddleware<T>(
  type: ZodObject<any>,
): RequestHandler {
  return (req, res, next) => {
    try {
      const data = type.parse(req.params);

      req.params = data;

      next();
    } catch (e: Error | any) {
      next(new ValidationException(e));
    }
  };
}

export function queryValidationMiddleware<T>(
  type: ZodObject<any>,
): RequestHandler {
  return (req, res, next) => {
    try {
      const data = type.parse(req.query);

      req.query = data;

      next();
    } catch (e: Error | any) {
      next(new ValidationException(e));
    }
  };
}
