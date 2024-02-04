// cores
import express from 'express';
import morgan from 'morgan';

// 3rd
import versionOne from './Versions/version-one';
import { globalError } from './controllers/error-controller';
import appError from './utils/app-error';

// app
const app = express();
app.use(morgan('dev'));

app.use('api/v1/', versionOne);
app.use('*', (req, res, next) => {
  return next(new appError('This route does not exist', 404));
});
app.use(globalError);

export default app;
