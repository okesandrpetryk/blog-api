import type { NextFunction, Response } from 'express';

import { HttpStatus } from '../../shared/http-status';
import { IToken, PreProtectedRequest } from '../interfaces';
import { tokensService } from '../tokens.service';

export const authGuard = async (
  req: PreProtectedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('Access token required');
    }

    const decodedToken = (await tokensService.verifyAccessToken(
      req.headers.authorization.split(' ')[1],
    )) as IToken;

    req.user = decodedToken;

    next();
  } catch (e: unknown) {
    console.log(e);
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
};
