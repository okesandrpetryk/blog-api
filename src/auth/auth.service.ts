import * as bcryptjs from 'bcryptjs';

import { ENV } from '../config';
import { BadRequestException } from '../shared/exceptions';
import { User } from '../user/models/user.model';
import { ILoginDto, IRegisterDto } from './dto/auth.dto';
import { Session } from './models/auth.model';
import { tokensService } from './tokens.service';

class AuthService {
  async register(data: IRegisterDto) {
    const emailCandidate = await User.findOne({
      email: data.email,
    });

    if (emailCandidate) {
      throw new BadRequestException('Email already exists');
    }

    const usernameCandidate = await User.findOne({
      email: data.email,
    });

    if (usernameCandidate) {
      throw new BadRequestException('Username already exists');
    }

    const passwordHash = bcryptjs.hashSync(data.password, ENV.PASSWORD_SALT);

    const newUser = new User({
      ...data,
      password: passwordHash,
    });

    await newUser.save();
  }

  async logIn(data: ILoginDto) {
    const candidate = await User.findOne({
      $or: [
        {
          username: data.username,
        },
        {
          email: data.email,
        },
      ],
    });

    if (!candidate) {
      throw new Error(`Bad password or ${data.email ?? data.username}`);
    }

    if (!bcryptjs.compareSync(data.password, candidate.password)) {
      throw new Error(`Bad password or ${data.email ?? data.username}`);
    }

    const tokens = await tokensService.generateTokens({
      _id: candidate._id.toString(),
    });

    await Session.create({
      refreshToken: tokens.refreshToken,
      userId: candidate._id,
    });

    return tokens;
  }

  async logOut(refreshToken: string) {
    const decodedToken = await tokensService.verifyRefreshToken(refreshToken);

    if (typeof decodedToken === 'string') {
      throw new Error('Bad refresh token');
    }

    const sessionCandidate = await Session.findOne({
      refreshToken,
      userId: decodedToken._id,
    });

    if (!sessionCandidate) {
      throw new Error('Session not exists');
    }

    await Session.deleteOne({
      _id: sessionCandidate._id,
    });
  }

  async refresh(refreshToken: string) {
    const decodedToken = await tokensService.verifyRefreshToken(refreshToken);

    if (typeof decodedToken === 'string') {
      throw new Error('Bad decoded refresh token');
    }

    const userCandidate = await User.findOne({
      _id: decodedToken._id,
    });

    if (!userCandidate) {
      throw new Error('User not exists');
    }

    const tokens = await tokensService.generateTokens({
      _id: userCandidate._id.toString(),
    });

    const sessionCandidate = await Session.findOne({
      userId: userCandidate._id,
      refreshToken,
    });

    if (!sessionCandidate) {
      throw new Error('Session not exists');
    }

    await Session.updateOne(
      {
        _id: sessionCandidate._id,
      },
      { refreshToken: tokens.refreshToken },
    );

    return tokens;
  }
}

export const authService = new AuthService();
