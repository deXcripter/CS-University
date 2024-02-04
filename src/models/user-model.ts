import mongoose from 'mongoose';
import validate from 'validator';

interface iUser {
  username: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  Coverphoto?: string;
}

const userSchema = new mongoose.Schema<iUser>({
  username: {
    type: String,
  },
  email: {
    type: String,
    validate: validate.isEmail,
    required: [true, 'An email must be present'],
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirm: {
    type: String,
    required: true,
  },
  Coverphoto: {
    type: String,
  },
});

// userSchema.pre('save', (next)=> {
//   const user = this;
//   if (user.isModified)

// })

const User = mongoose.model('User', userSchema);

module.exports = User;
