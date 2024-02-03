import { RequestHandler } from 'express';

export const singup: RequestHandler = (req, res, next) => {
  const { email, password, confirmPassword } = req.body as {
    email: string;
    password: string;
    confirmPassword: string;
  };

  if (!email || !password || !confirmPassword) {
    // return next()
  }
};
