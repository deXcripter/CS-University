import mongoose from 'mongoose';
import validate from 'validator';
import { iUser } from '../utils/interfaces';
import bcrypt from 'bcryptjs';
import { getUnpackedSettings } from 'http2';

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
  Coverphoto: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isNew || !this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password as string, 12);
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);
export default User;
