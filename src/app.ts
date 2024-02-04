// cores
import express from 'express';

// 3rd
import versionOne from './Versions/version-one';
import { globalError } from './controllers/error-controller';

// app
const app = express();

app.use('api/v1/', versionOne);
app.use('*', (req, res, next) => {
  res
    .status(404)
    .json({ status: 'failed', message: 'This route does not exist' });
});
app.use(globalError);

export default app;
