import type { Request } from 'express';

export interface IToken {
  _id: string;
}

export interface ProtectedRequest extends Request {
  user?: IToken;
}
