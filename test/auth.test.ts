import type { Application } from 'express';
import { connect, connection } from 'mongoose';
import request from 'supertest';

import { bootstrap } from '../src/app';
import { Session } from '../src/auth/models/auth.model';
import { ENV } from '../src/config';
import { User } from '../src/user/models/user.model';
import { clearDatabase } from './utils/clear-database.util';
import getCookies from './utils/get-cookies';
import { sleep } from './utils/sleep';

describe('Test Auth module', () => {
  let app: Application;

  beforeAll(async () => {
    app = bootstrap();

    await connect(ENV.MONGODB_URL);
    await clearDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  const user: Record<string, string> = {
    email: 'john@mail.com',
    username: 'john',
    password: 'main1234',
    refreshToken: '',
    accessToken: '',
  };

  it('register', async () => {
    const usersBefore = await User.find();

    await request(app).post('/auth/register').send(user).expect(201);

    const usersAfter = await User.find();

    expect(usersAfter.length - usersBefore.length).toBe(1);

    const newUser = await User.findOne({ email: user.email });

    if (!newUser) {
      throw new Error('User not created');
    }

    expect(user).toMatchObject({
      email: newUser.email,
      username: newUser.username,
      password: user.password,
    });
  });

  it('login user', async () => {
    const r = await request(app).get('/auth/log-in').send(user).expect(200);

    const sessions = await Session.find({});

    expect(sessions).toHaveLength(1);
    expect(r.body.accessToken).toBeDefined();

    const cookies = getCookies(r);

    expect(cookies.refreshToken.value).toBe(sessions[0].refreshToken);
    expect(cookies.refreshToken.HttpOnly).toBe(true);

    if (!cookies.refreshToken.value) {
      throw new Error('Refresh token should has value');
    }

    user.refreshToken = cookies.refreshToken.value;
    user.accessToken = r.body.accessToken;
  });

  it('refresh tokens', async () => {
    await sleep(1000);

    const r = await request(app)
      .get('/auth/refresh')
      .set('Cookie', [`refreshToken=${user.refreshToken}`])
      .expect(200);

    const sessions = await Session.find({});

    expect(sessions).toHaveLength(1);
    expect(r.body.accessToken).toBeDefined();

    const cookies = getCookies(r);

    expect(cookies.refreshToken.value).toBe(sessions[0].refreshToken);
    expect(cookies.refreshToken.HttpOnly).toBe(true);

    if (!cookies.refreshToken.value) {
      throw new Error('Refresh token should has value');
    }

    user.refreshToken = cookies.refreshToken.value;
    user.accessToken = r.body.accessToken;
  });

  it('log out user', async () => {
    await request(app)
      .get('/auth/log-out')
      .set('Cookie', [`refreshToken=${user.refreshToken}`])
      .expect(200);

    const sessions = await Session.find({});

    expect(sessions).toHaveLength(0);
  });
});
