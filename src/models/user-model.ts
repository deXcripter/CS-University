import mongoose from 'mongoose';
import validate from 'validator';
import { iUser } from '../utils/interfaces';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto, { createHash, randomBytes } from 'crypto';

const userSchema = new mongoose.Schema<iUser>({
  username: {
    type: String,
  },
  email: {
    type: String,
    validate: validate.isEmail,
    required: [true, 'An email must be present'],
    unique: [true, 'This email already exists'],
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
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password as string, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1500;
  next();
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
    const accountTimeStamp = parseInt(this.passwordChangedAt, 10);
    return accountTimeStamp > decodedTimeStamp;
  }
  return false;
};

userSchema.methods.setPasswordResetToken = function () {
  const resetToken = randomBytes(12).toString('hex');
  this.password = createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 1000 * 60 * 5;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
