import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { HttpStatus } from '../shared/http-status';
import { bodyValidationMiddleware } from '../shared/middlewares/validation.middleware';
import { authService } from './auth.service';
import { LogInDto, RegisterDto } from './dto/auth.dto';

export class AuthController {
  readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.post(
      '/register',
      bodyValidationMiddleware(RegisterDto),
      this.register,
    );
    this.router.get('/log-in', bodyValidationMiddleware(LogInDto), this.logIn);
    this.router.get('/log-out', this.logOut);
    this.router.get('/refresh', this.refresh);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.register(req.body);

      res.sendStatus(201);
    } catch (e: any) {
      res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
    }
  }

  async logIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken, accessToken } = await authService.logIn(req.body);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60,
      });
      res.json({ accessToken });
    } catch (e: any) {
      console.log(e);
      res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
    }
  }

  async logOut(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('refreshToken');

      await authService.logOut(req.cookies.refreshToken);

      res.sendStatus(200);
    } catch (e: any) {
      res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken, accessToken } = await authService.refresh(
        req.cookies.refreshToken,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60,
      });

      res.json({
        accessToken,
      });
    } catch (e: any) {
      res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
    }
  }
}
