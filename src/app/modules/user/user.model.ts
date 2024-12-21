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
      default: 'user',
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

userSchema.statics.isUserExist = async function (
  id: string,
): Promise<TUser | null> {
  // Find the user by their ID
  const user = await this.findById(id);
  return user;
};

userSchema.statics.isUserExistByEmail = async function (
  email: string,
): Promise<TUser | null> {
  // Find the user by their ID
  const user = await this.findOne({ email });
  return user;
};

// hash the user password before saving when creating new user
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

export const User = model<TUser, TUserModel>('User', userSchema);
