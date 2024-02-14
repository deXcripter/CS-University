import mongoose from 'mongoose';
import validate from 'validator';
import { iUser } from '../utils/interfaces';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { createHash, randomBytes } from 'crypto';

const userSchema = new mongoose.Schema<iUser>({
  username: {
    type: String,
    unique: [true, 'Username taken. Please choose another'],
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
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: [8, 'passwordConfirm must be longer than 8 characters'],
    required: true,
    validate: {
      validator: function (val: string) {
        return (this as unknown as iUser).password === val;
      },
      message: "Passwords don't match",
    },
  },

  coverPhoto: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetExpires: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

// pre-save (before saving) mongoose M.Ws
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

// mongoose query M.Ws
userSchema.pre(/^find/, function (next) {
  (this as any).find({ active: { $ne: false } });
  next();
});

// mongoose custom methods
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
  this.passwordResetToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 1000 * 60 * 5;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
