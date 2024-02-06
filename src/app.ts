// cores
import express from 'express';
import morgan from 'morgan';

// 3rd
import versionOne from './versions/version-one';
import { globalError } from './controllers/error-controller';
import appError from './utils/app-error';

// app
const app = express();
app.use(express.json());
app.use(morgan('dev'));

// middlewares
console.log(process.env.NODE_ENV);
app.use('/api/v1/', versionOne);

app.use('*', (req, res, next) => {
  return next(new appError('This route does not exist', 404));
});
app.use(globalError);

export default app;
