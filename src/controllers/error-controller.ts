import { RequestHandler, Request, Response, NextFunction } from 'express';
import appError from '../utils/app-error';

// INTERFACES
interface Err extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

// FUNCTIONS
// -- HANDLE DEVELOPMENT ERRORS HERE
const handleDevelopmentErrors = (err: Err, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// -- HANDLE PRODUCTION ERRORS HERE

// MAIN GLOBAL ERROR HANDLER
export const globalError = (
  err: Err,
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
  }
};
