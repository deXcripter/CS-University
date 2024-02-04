import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import appError from '../utils/app-error';
import { iEnv } from '../utils/interfaces';
import User from '../models/user-model';

// functions
const singToken: Function = (payload: number | string) => {
  jwt.sign({ payload }, (process.env as unknown as iEnv).SECRET_KEY, {
    expiresIn: (process.env as unknown as iEnv).TOKEN_EXPIRATION,
  });
};

// controllers
export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm } = req.body as {
      email: string;
      password: string;
      passwordConfirm: string;
    };

    if (!email || !password || !passwordConfirm) {
      // console.log(email, password, passwordConfirm);

      return next(new appError('Incomplete credentials', 400));
    }

    const body = {
      email,
      password,
      passwordConfirm,
    };

    // creating the new user
    console.log(body);
    try {
      const user = await User.create(body);
    } catch (err) {
      return next(err);
    }

    // sign and issue the token
    const token = singToken(email);

    res.status(200).json({ status: 'success', message: 'user created', token });
  } catch (err) {
    return next(err);
  }
};
