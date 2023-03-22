import jwt from 'jsonwebtoken';

import { ENV } from '../config';
import { IToken } from './interfaces';

export class TokensService {
  async generateAccessToken(data: IToken) {
    return jwt.sign(data, ENV.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(data: IToken) {
    return jwt.sign(data, ENV.JWT_REFRESH_SECRET, {
      expiresIn: '15m',
    });
  }

  async generateTokens(data: IToken) {
    return {
      accessToken: await this.generateAccessToken(data),
      refreshToken: await this.generateRefreshToken(data),
    };
  }

  async verifyAccessToken(token: string) {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
  }

  async verifyRefreshToken(token: string) {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  }
}

export const tokensService = new TokensService();
