import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidations } from './blog.validation';
import { BlogControllers } from './blog.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/', BlogControllers.fetchAllBlogs);

router.post(
  '/',
  auth('user'),
  validateRequest(BlogValidations.blogValidationSchema),
  BlogControllers.createBlog,
);

router.patch(
  '/:id',
  auth('user'),
  validateRequest(BlogValidations.blogValidationSchema),
  BlogControllers.updateBlog,
);

router.delete('/:id', auth('user'), BlogControllers.deleteBlog);

export const BlogRoutes = router;
