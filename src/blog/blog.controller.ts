import { NextFunction, Request, Response, Router } from 'express';

import { ProtectedRequest } from '../auth/interfaces';
import { authGuard } from '../auth/middlewares/auth.middleware';
import { BadRequestException } from '../shared/exceptions';
import { HttpStatus } from '../shared/http-status';
import { bodyValidationMiddleware } from '../shared/middlewares/validation.middleware';
import { blogService } from './blog.service';
import { PostDto } from './dto/post.dto';

export class BlogController {
  readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.get('post', authGuard, this.getPosts);
    this.router.post(
      'post',
      authGuard,
      bodyValidationMiddleware(PostDto),
      this.createPost,
    );
    // this.router.patch('post/:id', authGuard, this.updatePost);
    // this.router.delete('post/:id', authGuard, this.deletePost);
    // this.router.get(':username/post', authGuard, this.getPostsByUsername);
    // this.router.get(':username/post/:id', authGuard, this.getPostById);
  }

  async getPosts(req: ProtectedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new BadRequestException();
      }

      const posts = await blogService.getPosts(req.user);

      res.json(posts);
    } catch (e: any) {
      res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
    }
  }

  async createPost(req: ProtectedRequest, res: Response) {
    try {
      if (!req.user) {
        throw new BadRequestException();
      }

      const newPost = await blogService.createPost(req.user, req.body);

      res.json(newPost).status(HttpStatus.CREATED);
    } catch (e: any) {
      res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
    }
  }

  // async updatePost(req: Request, res: Response, next: NextFunction) {
  //   try {
  //   } catch (e: any) {
  //     res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
  //   }
  // }
  //
  // async deletePost(req: Request, res: Response, next: NextFunction) {
  //   try {
  //   } catch (e: any) {
  //     res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
  //   }
  // }
  //
  // async getPostsByUsername(req: Request, res: Response, next: NextFunction) {
  //   try {
  //   } catch (e: any) {
  //     res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
  //   }
  // }
  //
  // async getPostById(req: Request, res: Response, next: NextFunction) {
  //   try {
  //   } catch (e: any) {
  //     res.json(e.message).status(e.status || HttpStatus.BAD_REQUEST);
  //   }
  // }
}
