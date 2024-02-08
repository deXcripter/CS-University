import express from 'express';
import {
  forgetPassword,
  login,
  protection,
  signup,
  updatePassword,
} from '../controllers/auth-controller';
import { getUsers } from '../controllers/user-controller';

const Router = express.Router();

// auth
Router.post('/signup', signup);
Router.post('/login', login);
Router.post('/updatepassword', protection, updatePassword);
Router.post('/forgotpassword', forgetPassword);

// normal controllers
Router.route('/').get(protection, getUsers).post(signup).patch().delete();

export default Router;
