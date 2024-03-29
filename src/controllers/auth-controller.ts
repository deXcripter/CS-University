import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import appError from '../utils/app-error';
import { iBody, iEnv, iReq } from '../utils/interfaces';
import User from '../models/user-model';
import { tSignToken } from '../utils/types';
import { sendEmail } from '../utils/email';
import { createHash } from 'crypto';

// functions
const signToken: tSignToken = (payload: number | string) => {
  return jwt.sign(
    { id: payload },
    (process.env as unknown as iEnv).SECRET_KEY,
    {
      expiresIn: (process.env as unknown as iEnv).TOKEN_EXPIRATION,
    }
  );
};

const createSendToken = (user: object, statusCode: number, res: Response) => {
  const dateNum: number = Date.now();

  const token = signToken((user as { _id: string })._id);
  const cookieOptions = {
    expires: new Date(
      dateNum +
        (process.env as unknown as iEnv).JWT_COOKIE_EXPIRES_IN *
          1000 *
          60 *
          60 *
          35
    ),
    httpOnly: true,
    secure: false,
  };

  if ((process.env as unknown as iEnv).NODE_ENV === 'production')
    cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  (user as { password: undefined }).password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// controllers
export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, username } = req.body as iBody;

    if (!email || !password || !passwordConfirm) {
      return next(new appError('Incomplete credentials', 400));
    }

    const body = {
      email,
      password,
      passwordConfirm,
      username,
    };

    // creating the new user
    const user: any = await User.create(body);
    if (!user) return next(new appError('Error creating account', 400));

    // sign and issue the token
    const token = signToken(user._id);

    createSendToken(user, 200, res);
  } catch (err) {
    return next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const email: string = (req.body as iBody).email;
    const password: string = (req.body as iBody).password;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePasswords!(password, user.password)))
      return next(new appError('Invalid credientials', 400));

    const token: string = signToken(user._id.toString());

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'user logged out' });
};

export const protection: RequestHandler = async (req, res, next) => {
  try {
    // fetching the token
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

    // assembling the message to send the user
    const resetLink = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/${resetToken}`;

    const message = `Send a PATCH request to ${resetLink} to reset your password. Kindly ignore this message if you did not initiate it`;

    // send the reset token to the user
    try {
      await sendEmail({ email, message });
    } catch (err) {
      return next(err);
    }
    res.status(200).json({ status: 'success', message: 'email sent' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  // get the token from the req.params and hash it immeditely. use it to find a user from the db
  let reqToken = req.params.token;
  if (!reqToken)
    return next(
      new appError('sorry, your are not allowed to make this request', 400)
    );
  const hashedToken = createHash('sha256').update(reqToken).digest('hex');

  // if token is still valid, and there is a user, set new password
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // update changedpasswordat property for the user
  if (!user) return next(new appError('Token is invalid or expired', 400));

  createSendToken(user, 201, res);
};
