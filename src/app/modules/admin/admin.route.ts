import { Router } from 'express';
import { AdminControllers } from './admin.controller';

const router = Router();

router.patch('/users/:userId/block', AdminControllers.blockAnUser);

export const AdminRoutes = router;
