import { model, Schema, Types } from 'mongoose';

export interface IPost {
  author: Types.ObjectId;
  title: string;
  content: string;
}

export const postSchema = new Schema<IPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: String,
  content: String,
});

export const Post = model<IPost>('Post', postSchema);
