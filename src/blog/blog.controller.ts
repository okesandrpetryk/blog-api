import { Router } from 'express';

export class BlogController {
  readonly router: Router;

  constructor() {
    this.router = Router();

    // this.router.get('post', this.getPost);
    // this.router.post('post', this.createPost);
    // this.router.patch('post', this.updatePost);
    // this.router.delete('post', this.deletePost);
  }

  // async getPost(req: Request, res: Response, next: NextFunction) {}

  // async createPost(req: Request, res: Response, next: NextFunction) {}

  // async updatePost(req: Request, res: Response, next: NextFunction) {}

  // async deletePost(req: Request, res: Response, next: NextFunction) {}
}
