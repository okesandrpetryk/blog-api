import cookieParse from 'cookie-parser';
import express from 'express';

import { AuthController } from './auth/auth.controller';
import { BlogController } from './blog/blog.controller';

const app = express();

export function bootstrap() {
  // Initialize controllers
  const blogController = new BlogController();
  const authController = new AuthController();

  // Setup middlewares
  app.use(cookieParse());
  app.use(express.json());

  // Setup routers
  app.use('/blog', blogController.router);
  app.use('/auth', authController.router);

  return app;
}
