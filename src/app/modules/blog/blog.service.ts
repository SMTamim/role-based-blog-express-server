import { JwtPayload } from 'jsonwebtoken';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchAbleFields } from './blog.constant';
import NotFoundError from '../../error/NotFoundError';

const createBlogIntoDB = async (userPayload: JwtPayload, payload: TBlog) => {
  const user = await User.findOne({ email: userPayload.email });
  if (!user) {
    throw new NotFoundError('User');
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
  const blogQuery = new QueryBuilder(Blog.find({}), query)
    .search(blogSearchAbleFields)
    .filter()
    .sort();
  const result = await blogQuery.modelQuery.populate({
    path: 'author',
    select: '_id name email',
  });
  return result;
};

const updateBlogIntoDB = async (
  user: JwtPayload,
  blogId: string,
  payload: Pick<TBlog, 'title' | 'content'>,
) => {
  const blog = await Blog.isBlogExist(blogId);
  if (!blog) throw new NotFoundError('Blog');

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

  if (!updatedBlog) throw new NotFoundError('Blog');

  return {
    _id: updatedBlog._id,
    title: updatedBlog.title,
    content: updatedBlog.content,
    author: updatedBlog.author,
  };
};

const deleteBlogFromDB = async (user: JwtPayload, blogId: string) => {
  const blog = await Blog.isBlogExist(blogId);
  if (!blog) throw new NotFoundError('Blog');

  if (user.role !== 'admin') {
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
  }
  await Blog.findByIdAndUpdate(
    blogId,
    { isDeleted: true },
    { new: true, runValidators: true },
  );
};

export const BlogServices = {
  createBlogIntoDB,
  fetchAllBlogsFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
};
