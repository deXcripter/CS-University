import express from 'express';

import versionOne from './Versions/version-one';
const app = express();

app.use('api/v1/', versionOne);

export default app;
