import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser, TUserModel } from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordUpdatedAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  },
);

/**
 * A static method on the User model that checks if a user with the given ID already exists.
 * @param id - The ID of the user to check.
 * @returns The user document if the user exists, otherwise null.
 */
userSchema.statics.isUserExist = async function (
  id: string,
): Promise<TUser | null> {
  // Find the user by their ID
  const user = await this.findById(id);
  return user;
};

// hash the user password before saving when creating new user
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    config.bcrypt_salt_round as string,
  );
  next();
});

export const User = model<TUser, TUserModel>('User', userSchema);
