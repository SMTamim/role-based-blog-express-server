import httpStatus from 'http-status';
import AppError from '../error/AppError';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AppError(httpStatus.UNAUTHORIZED, 'Not logged in!');
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { email, role, iat } = decoded;
    const user = await User.isUserExistByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid access token!');
    }
    if (user.isDeleted) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid access token!');
    }
    if (user.isBlocked) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You have been blocked');
    }
    if (user.passwordUpdatedAt && iat) {
      const passwordChangedTime = user.passwordUpdatedAt.getTime();
      if (passwordChangedTime > iat) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Password changed, please login again',
        );
      }
    }
    if (!requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to access');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
