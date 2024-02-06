import mongoose from 'mongoose';
import validate from 'validator';
import { iUser } from '../utils/interfaces';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema<iUser>({
  username: {
    type: String,
  },
  email: {
    type: String,
    validate: validate.isEmail,
    required: [true, 'An email must be present'],
    unique: [true, 'Email already exist'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: function (val: string) {
      return (this as iUser).password === val;
    },
  },
  coverPhoto: {
    type: String,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isNew || !this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password as string, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.comparePasswords = async (
  trialPassword: string,
  storedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(trialPassword, storedPassword);
};

const User = mongoose.model('User', userSchema);
export default User;
