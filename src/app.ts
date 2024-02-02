import express from 'express';

const app = express();

app.use('/', (req, res) => {
  res.send('<h1> Hello from the server </h1>');
});

export default app;
