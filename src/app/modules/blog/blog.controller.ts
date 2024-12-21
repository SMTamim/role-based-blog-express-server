import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';

const fetchAllBlogs = catchAsync(async (req, res) => {
  const result = await BlogServices.fetchAllBlogsFromDB(req.query);
  sendResponse(res, {
    success: true,
    message: 'Blogs fetched successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

const createBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlogIntoDB(req.user, req.body);
  sendResponse(res, {
    success: true,
    message: 'Blog created successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { id: blogId } = req.params;
  const result = await BlogServices.updateBlogIntoDB(
    req.user,
    blogId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    message: 'Blog updated successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id: blogId } = req.params;
  await BlogServices.deleteBlogFromDB(req.user, blogId);
  sendResponse(res, {
    success: true,
    message: 'Blog deleted successfully',
    statusCode: httpStatus.OK,
  });
});

export const BlogControllers = {
  createBlog,
  updateBlog,
  fetchAllBlogs,
  deleteBlog,
};
