import { NextFunction, Request, Response } from 'express';

import { IToken } from '../auth/interfaces';
import { HttpStatus } from '../shared/http-status';
import { User } from '../user/models/user.model';
import { IPostDto } from './dto/post.dto';
import { Post } from './models/post.model';

class BlogService {
  async getPosts(user: IToken) {
    return Post.find({
      author: user._id,
    });
  }

  async createPost(user: IToken, data: IPostDto) {
    const authorCandidate = await User.findOne({
      _id: user._id,
    });

    const newPost = await Post.create({
      author: authorCandidate,
      ...data,
    });

    return newPost;
  }

  // async updatePost() {}
  //
  // async deletePost() {}
  //
  // async getPostsByUsername() {}
  //
  // async getPostById() {}
}

export const blogService = new BlogService();
