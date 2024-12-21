import { JwtPayload } from 'jsonwebtoken';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const createBlogIntoDB = async (userPayload: JwtPayload, payload: TBlog) => {
  const user = await User.findOne({ email: userPayload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  payload.author = user._id;
  const blog = await Blog.create(payload);
  if (blog) {
    return {
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      author: (
        await blog.populate({
          path: 'author',
          select: '_id name email',
        })
      ).author,
    };
  }
  return null;
};

const fetchAllBlogsFromDB = async (query: Record<string, unknown>) => {
  return await Blog.find({})
    .populate({
      path: 'author',
      select: '_id name email',
    })
    .lean();
};

const updateBlogIntoDB = async (
  user: JwtPayload,
  blogId: string,
  payload: Pick<TBlog, 'title' | 'content'>,
) => {
  const blog = await Blog.isBlogExist(blogId);
  if (!blog) throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');

  const isOwner = await Blog.blogBelongsToUser(
    blog.author.toString(),
    user.email,
  );
  if (!isOwner) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You don't have permission to edit this blog",
    );
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, payload, {
    new: true,
    runValidators: true,
  }).populate('author');

  if (!updatedBlog) throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');

  return {
    _id: updatedBlog._id,
    title: updatedBlog.title,
    content: updatedBlog.content,
    author: updatedBlog.author,
  };
};

export const BlogServices = {
  createBlogIntoDB,
  fetchAllBlogsFromDB,
  updateBlogIntoDB,
};
