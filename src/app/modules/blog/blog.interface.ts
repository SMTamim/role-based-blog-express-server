import { Model, Types } from 'mongoose';

export interface TBlog {
  title: string;
  content: string;
  author: Types.ObjectId;
  isPublished: boolean;
  isDeleted: boolean;
}

export interface TBlogModel extends Model<TBlog> {
  isBlogExist(id: string): Promise<TBlog | null>;
  blogBelongsToUser(blogUserId: string, userEmail: string): Promise<boolean>;
}
