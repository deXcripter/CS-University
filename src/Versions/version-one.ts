import express from 'express';
import userRouter from '../routes/user-routes';

const app = express();

app.use('/users', userRouter);

export default app;
