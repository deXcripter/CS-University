import { RequestHandler } from 'express';
import User from '../models/user-model';
import { iReq } from '../utils/interfaces';
import appError from '../utils/app-error';

export const getUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ message: 'sucess', data: users });
};

export const deleteMe: RequestHandler = async (req, res, next) => {
  const user = await User.findById((req as iReq).loggedUser.id).select(
    '+active'
  );

  if (!user) return new appError('No user found, Please login again', 404);
  user.active = false;
  user.save({ validateBeforeSave: false });

  res.status(204).json({ status: 'success', message: 'user deleted' });
};
