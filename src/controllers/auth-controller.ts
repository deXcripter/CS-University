import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const singup: RequestHandler = (req, res, next) => {
  const { email, password, confirmPassword } = req.body as {
    email: string;
    password: string;
    confirmPassword: string;
  };

  if (!email || !password || !confirmPassword) {
    return next();
  }
  console.log('user sugnup');

  res.status(200).json({ status: 'success', message: 'user created' });
};
