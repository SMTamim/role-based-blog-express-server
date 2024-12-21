import { Router } from 'express';
import { AdminControllers } from './admin.controller';
import { BlogControllers } from '../blog/blog.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.patch('/users/:userId/block', AdminControllers.blockAnUser);

router.delete('/blogs/:id', auth('admin'), BlogControllers.deleteBlog);

export const AdminRoutes = router;
