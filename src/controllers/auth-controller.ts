import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import appError from '../utils/app-error';
import { iBody, iDecoded, iEnv, iUser } from '../utils/interfaces';
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
    const user: any = await User.create(body);
    if (!user) return next(new appError('Error creating account', 400));

    // sign and issue the token
    const token = singToken(user._id);

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

  const user = await User.findOne({ email })
    .select('password')
    .maxTimeMS(15000);

  if (!user || !(await user.comparePasswords!(password, user.password)))
    return next(new appError('Invalid credientials', 400));

  const token: string = singToken(user._id.toString());

  res
    .status(200)
    .json({ status: 'success', message: 'logged in', data: user, token });
};

export const protection: RequestHandler = async (req, res, next) => {
  console.log('running protection middleware');

  if (!req.headers.authorization)
    return next(new appError(' login to access this route', 403));

  const token = req.headers.authorization?.split(' ').at(1);
  const Bearer = req.headers.authorization?.split(' ').at(0);

  if (!Bearer?.startsWith('Bearer') || !token) {
    return next(new appError(' login to access this route', 403));
  }

  // change this any type later
  const decoded: any = jwt.verify(
    token,
    (process.env as any as iEnv).SECRET_KEY
  );

  // finding the user
  const user = await User.findById(decoded.id);
  if (!user) return next(new appError('This user does not exists', 403));

  console.log(user);

  next();
};
