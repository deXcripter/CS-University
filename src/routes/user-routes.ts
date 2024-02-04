import express, { Router } from 'express';
import { singup } from '../controllers/auth-controller';

const router = Router();

// auth
router.post('/signup', singup);

// normal controllers
router.route('/').get().post().patch().delete();

export default router;
