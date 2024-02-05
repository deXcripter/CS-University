import { Request, Response, NextFunction } from 'express';
import appError from '../utils/app-error';
import { iErr } from '../utils/interfaces';

// FUNCTIONS
// -- HANDLE DEVELOPMENT ERRORS HERE
const handleDevelopmentErrors = (err: iErr, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// -- HANDLE PRODUCTION ERRORS HERE
const handleOperationalErrors = (err: iErr, req: Request, res: Response) => {
  console.log('handling operational error`');
  console.log(err);
  return res.status(err.statusCode).json({ message: err.message });
};

const handleError11000 = (err: iErr, req: Request, res: Response) => {
  const key = Object.keys(err.keyValue!);
  const message: string = `${key} is already in use. Please choose another`;
  return new appError(message, 400);
};

// MAIN GLOBAL ERROR HANDLER
export const globalError = (
  err: iErr,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    handleDevelopmentErrors(err, req, res);
  }

  if (process.env.NODE_ENV === 'production') {
    if (err.code === 11000) err = handleError11000(err, req, res);

    // finally
    err.isOperational && handleOperationalErrors(err, req, res);
  }
};
