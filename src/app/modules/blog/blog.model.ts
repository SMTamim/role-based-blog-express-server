import { model, Schema } from 'mongoose';
import { TBlog, TBlogModel } from './blog.interface';
import { User } from '../user/user.model';

const blogSchema = new Schema<TBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// to exclude deleted blogs
blogSchema.pre('find', function (next) {
  this.where({ isDeleted: false });
  next();
});

blogSchema.statics.isBlogExist = async function (
  id: string,
): Promise<TBlog | null> {
  // Find the user by their ID
  const blog = await this.findOne({ _id: id, isDeleted: false });
  return blog;
};

blogSchema.statics.blogBelongsToUser = async function (
  blogUserId: string,
  userEmail: string,
): Promise<boolean> {
  const user = await User.findOne({ email: userEmail });
  return user?._id.toString() === blogUserId;
};

export const Blog = model<TBlog, TBlogModel>('Blog', blogSchema);
