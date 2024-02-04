// core modules
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// dependencies & 3rd-parties
dotenv.config({ path: path.resolve(__dirname, '../config.env') });
import app from './app';

mongoose
  .connect(process.env.LOCAL_DATABASE as string)
  .then((data) => console.log('DB Connected'));

const server = http.createServer(app);

// running the server
const port = (process.env as { PORT: string }).PORT;
server.listen(port, () => {
  console.log(`Server is currently running on port ${port}`);
});
