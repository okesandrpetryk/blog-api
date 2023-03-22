import dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';
import path from 'path';

dotenv.config({ path: path.join(path.resolve(), '.env') });

export const NODE_ENV_ARRAY = ['dev', 'prod', 'test'];
export const NODE_ENV_OBJECT = {
  dev: 'dev',
  prod: 'prod',
  test: 'test',
};

export const ENV = cleanEnv(process.env, {
  PORT: num(),
  MONGODB_URL: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_SECRET: str(),
  PASSWORD_SALT: num(),
  NODE_ENV: str({ choices: NODE_ENV_ARRAY }),
});

if (
  ENV.NODE_ENV === NODE_ENV_OBJECT.dev ||
  ENV.NODE_ENV === NODE_ENV_OBJECT.test
) {
  console.log(`${ENV.NODE_ENV} config:`, ENV);
}
