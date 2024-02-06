import express from 'express';
import { login, protection, signup } from '../controllers/auth-controller';
import { getUsers } from '../controllers/user-controller';

const Router = express.Router();

// auth
Router.post('/signup', signup);
Router.post('/login', login);

// normal controllers
Router.route('/').get(protection, getUsers).post(signup).patch().delete();

export default Router;
