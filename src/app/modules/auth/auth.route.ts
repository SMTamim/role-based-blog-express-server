import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { UserControllers } from '../user/user.controller';

const router = Router();

// register new user
router.post(
  '/register',
  validateRequest(AuthValidations.createUserValidationSchema),
  UserControllers.createUser,
);

export const AuthRoutes = router;
