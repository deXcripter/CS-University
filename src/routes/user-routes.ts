import express from 'express';
import { login, signup } from '../controllers/auth-controller';
import { getUsers } from '../controllers/user-controller';

const Router = express.Router();

// auth
Router.post('/signup', signup);
Router.post('/login', login);

// normal controllers
Router.route('/').get(getUsers).post(signup).patch().delete();

export default Router;
