import express from 'express';
import { signup } from '../controllers/auth-controller';

const Router = express.Router();

// auth
Router.post('/signup', signup);

// normal controllers
Router.route('/').get().post().patch().delete();

export default Router;
