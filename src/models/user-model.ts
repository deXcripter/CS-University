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
