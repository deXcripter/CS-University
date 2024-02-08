import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import appError from '../utils/app-error';
import {
  iBody,
  iDecoded,
  iEmail,
  iEnv,
  iErr,
  iReq,
  iUser,
} from '../utils/interfaces';
import User from '../models/user-model';
import { tSignToken } from '../utils/types';
import crypto from 'crypto';
import { sendEmail } from '../utils/email';

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
  try {
    const email: string = (req.body as iBody).email;
    const password: string = (req.body as iBody).password;

    const user = await User.findOne({ email }).select('+password');

    console.log(user);

    if (!user || !(await user.comparePasswords!(password, user.password)))
      return next(new appError('Invalid credientials', 400));

    const token: string = singToken(user._id.toString());

    res
      .status(200)
      .json({ status: 'success', message: 'logged in', data: user, token });
  } catch (err) {
    next(err);
  }
};

export const protection: RequestHandler = async (req, res, next) => {
  try {
    console.log('running protection middleware');

    // fetching the token
    console.log(req.headers.authorization);
    if (
      !req.headers.authorization ||
      !req.headers.authorization!.split(' ').at(0)!.startsWith('Bearer')
    ) {
      return next(new appError('login to access this route', 403));
    }

    // verifying the token
    const token: any = req.headers.authorization!.split(' ').at(1);
    if (!token || token === 'null')
      return next(new appError('login to access this route', 403));

    let decoded: any;
    try {
      decoded = jwt.verify(token, (process.env as any as iEnv).SECRET_KEY);

      console.log(decoded, token);
    } catch (err) {
      next(err);
    }

    // checking if user still exists
    const user = await User.findById(decoded.id).select('passwordChangedAt');
    if (!user) return next(new appError('This user does not exists', 403));

    // check the timestamp
    if (await user.comparePasswordChangedAt(decoded.iat))
      return next(new appError('please login to access this route', 403));

    // /passign the current uesr to the request
    (req as iReq).loggedUser = decoded;

    next();
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get inputs from the user
    console.log('updating password');
    const oldPassword = (req.body as iBody).oldPassword;
    const password = (req.body as iBody).password;
    const passwordConfirm = (req.body as iBody).passwordConfirm;

    if (!oldPassword || !password || !passwordConfirm) {
      return next(new appError('Please fill all fields', 401));
    }

    // comparing the passwords with the currently loggedin user's password
    const user = await User.findById((req as any as iReq).loggedUser.id).select(
      '+password'
    );

    if (!user || !(await user.comparePasswords!(oldPassword, user.password))) {
      return next(new appError('Invalid passord', 403));
    }

    // changing the passwords if it reaches this level
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    res.status(200).json({ status: 'success', message: 'password changed' });
  } catch (err) {
    next(err);
  }
};

export const forgetPassword: RequestHandler = async (req, res, next) => {
  try {
    // get the email of the account a user is trying t0 access
    const email = (req.body as iBody).email;
    const user = await User.findOne({ email }).maxTimeMS(10000);

    if (!user) return next(new appError('Invalid user', 401));

    const resetToken = user.setPasswordResetToken!();
    await user.save({ validateBeforeSave: false });

    const resetLink = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/${resetToken}`;

    const message = `Send a PATCH request to ${resetLink}. Kindly ignore this message if you did not initiate it`;

    // send the reset token to the user
    try {
      await sendEmail({ email, message });
    } catch (err) {
      return next(err);
    }

    //
    res.status(200).json({ status: 'success', message: 'Email sent' });
  } catch (err) {
    next();
  }
};

export const resetPassword: RequestHandler = () => {};
