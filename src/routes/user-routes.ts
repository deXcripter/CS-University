import express from 'express';
import {
  forgetPassword,
  login,
  protection,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/auth-controller';
import { deleteMe, getUsers } from '../controllers/user-controller';

const Router = express.Router();

// auth
Router.post('/signup', signup);
Router.post('/login', login);
Router.post('/forgotpassword', forgetPassword);
Router.patch('/updatepassword', protection, updatePassword);
Router.patch('/resetpassword/:token', resetPassword);
// Router.delete('/deleteme', deleteMe);

// normal controllers
Router.route('/')
  .get(protection, getUsers)
  .post()
  .patch()
  .delete(protection, deleteMe);

export default Router;
