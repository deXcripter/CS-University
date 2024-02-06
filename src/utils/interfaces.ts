// process.env interface
export interface iEnv {
  PORT: number;
  LOCAL_DATABASE: string;
  DATABASE: string;
  SECRET_KEY: string;
  TOKEN_EXPIRATION: string;
  HOST: string;
  NODEMAILER_USERNAME: string;
  NODEMAILER_PASSWORD: string;
  NODE_ENV: string;
}

// user-model interface
export interface iUser {
  username: {};
  email: {};
  password: {};
  passwordConfirm?: {};
  coverPhoto?: {};
  comparePasswords?: Function;
  passwordChangedAt: {};
}

// error-handler interface
export interface iErr extends Error {
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
}

export interface iDecoded {
  id: string;
  iat: number;
  exp: number;
}
