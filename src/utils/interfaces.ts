import { Request } from 'express';

// process.env interface
export interface iEnv {
  PORT: number;
  LOCAL_DATABASE: string;
  DATABASE: string;
  SECRET_KEY: string;
  TOKEN_EXPIRATION: string;
  NODEMAILER_HOST: string;
  NODEMAILER_USERNAME: string;
  NODEMAILER_PASSWORD: string;
  NODE_ENV: string;
  EMAIL_HOST: string;
  NODEMAILER_PORT: number;
  JWT_COOKIE_EXPIRES_IN: number;
}

// user-model interface
export interface iUser {
  username: {};
  email: {};
  password: {};
  passwordConfirm?: {};
  coverPhoto?: {};
  comparePasswords?: Function;
  setPasswordResetToken?: Function;
  passwordChangedAt: Date | number;
  comparePasswordChangedAt: Function;
  passwordResetExpires: Date | number;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date | number;
}

// error-handler interface
export interface iErr extends Error {
  errno?: number;
  statusCode: number;
  status: string;
  isOperational: boolean;
  code?: number;
  keyValue?: {};
}

export interface iBody {
  name: string;
  password: string;
  passwordConfirm: string;
  email: string;
  username: string;
  oldPassword: string;
}

export interface iDecoded {
  id: string;
  iat: number;
  exp: number;
}

export interface iReq extends Request {
  loggedUser: {
    id: string;
    iat: string;
    exp: string;
  };
}

export interface iEmail {
  email: string;
  message: string;
  // to: string;
  // subject: string;
  // text: string;
}
