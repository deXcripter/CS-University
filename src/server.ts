import http from 'http';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

import app from './app';

const server = http.createServer(app);

// running the server
const port = (process.env as { PORT: string }).PORT;
server.listen(port, () => {
  console.log(`Server is currently running on port ${port}`);
});
