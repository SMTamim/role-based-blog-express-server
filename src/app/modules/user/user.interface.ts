import { Model } from 'mongoose';

export type TUserRole = 'user' | 'admin';

export interface TUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isBlocked: boolean;
  isDeleted: boolean;
  passwordUpdatedAt?: Date;
}

export interface TUserModel extends Model<TUser> {
  isUserExist(id: string): Promise<TUser | null>;
}
