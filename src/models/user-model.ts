import mongoose from 'mongoose';
import validate from 'validator';
import { iUser } from '../utils/interfaces';
import bcrypt from 'bcryptjs';
import validator from 'validator';

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
    required: [true, 'Please provide a password'],
    minlength: [8, 'password must be longer than 8 characters'],

    select: false,
  },

  passwordConfirm: {
    type: String,
    minlength: [8, 'passwordConfirm must be longer than 8 characters'],
    required: true,
    validate: {
      validator: function (val: string) {
        return (this as iUser).password === val;
      },
      message: "Passwords don't match",
    },
  },

  coverPhoto: {
    type: String,
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isNew || !this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password as string, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now() - 1500;
  return;
});

userSchema.methods.comparePasswords = async (
  trialPassword: string,
  storedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(trialPassword, storedPassword);
};

userSchema.methods.comparePasswordChangedAt = function (
  decodedTimeStamp: number
) {
  if (this.passwordChangedAt) {
    // const accountTimeStamp = ((this as any as iUser).passwordChangedAt.getTime() / 1000).toFixed(0);
    const accountTimeStamp = parseInt(this.passwordChangedAt, 10);
    return accountTimeStamp > decodedTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;
