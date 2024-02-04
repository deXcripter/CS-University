import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import appError from '../utils/app-error';
import { Env } from '../utils/interfaces';

// functions
const singToken: Function = (payload: number | string) => {
  jwt.sign({ payload }, (process.env as unknown as Env).SECRET_KEY, {
    expiresIn: (process.env as unknown as Env).TOKEN_EXPIRATION,
  });
};

// controllers

export const signup: RequestHandler = (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password, confirmPassword } = req.body as {
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    if (!email || !password || !confirmPassword) {
      return next(new appError('Incomplete credentials', 400));
    }

    // sign and issue the token
    const token = singToken(email);

    res.status(200).json({ status: 'success', message: 'user created', token });
  } catch (err) {
    return next(err);
  }
};
