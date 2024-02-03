import express from 'express';

import userRoute from './routes/user-routes';
const app = express();

app.use('api/v1/', (req, res) => {
  res.send('<h1> Hello from the server </h1>');
});

export default app;
