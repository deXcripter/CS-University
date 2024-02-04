import mongoose from 'mongoose';
import validate from 'validator';
import { iUser } from '../utils/interfaces';

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

const User = mongoose.model('User', userSchema);
export default User;
