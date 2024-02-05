import { RequestHandler } from 'express';
import User from '../models/user-model';

export const getUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find();

  console.log(users);
  res.status(200).json({ message: 'sucess', data: users });
};
