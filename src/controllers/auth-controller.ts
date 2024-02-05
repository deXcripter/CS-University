import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import appError from '../utils/app-error';
import { iBody, iEnv, iUser } from '../utils/interfaces';
import User from '../models/user-model';
import { tSignToken } from '../utils/types';

// functions
const singToken: tSignToken = (payload: number | string) => {
  return jwt.sign(
    { id: payload },
    (process.env as unknown as iEnv).SECRET_KEY,
    {
      expiresIn: (process.env as unknown as iEnv).TOKEN_EXPIRATION,
    }
  );
};

// controllers
export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm } = req.body as iBody;

    if (!email || !password || !passwordConfirm) {
      return next(new appError('Incomplete credentials', 400));
    }

    const body = {
      email,
      password,
      passwordConfirm,
    };

    // creating the new user
    try {
      await User.create(body);
    } catch (err) {
      return next(err);
    }

    // sign and issue the token
    const token = singToken(email);

    res
      .status(200)
      .json({ status: 'success', message: 'Account created', token });
  } catch (err) {
    return next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const email: string = (req.body as iBody).email;
  const password: string = (req.body as iBody).password;

  // User.findOne({ email })
  //   .maxTimeMS(15000)
  //   .then((doc) => (user = doc as iUser))
  //   .catch((err) => next(err));

  const user = await User.findOne({ email })
    .select('password')
    .maxTimeMS(15000);

  if (!user) return next(new appError('Invalid credientials', 400));

  const token: string = singToken(user._id.toString());

  res
    .status(200)
    .json({ status: 'success', message: 'logged in', data: user, token });
};
