import { Request } from 'express';

export interface IToken {
  _id: string;
}

export interface PreProtectedRequest extends Request {
  user?: IToken;
}

export interface ProtectedRequest extends Request {
  user: IToken;
}
