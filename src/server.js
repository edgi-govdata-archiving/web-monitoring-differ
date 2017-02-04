
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
// import multer from 'multer';

import healthCheck from './HealthCheck';
import diff from './Diff';

const app = express();
const port = process.env.TERROR_PORT || 8000;
const isProduction = (process.env.NODE_ENV === 'production');

const corsOpts = {
  origin: (origin, cb) => {
    cb(null, true);
  }
};

const ACCESS_LOG_PATH = process.env.ACCESS_LOG_PATH || path.join(__dirname, 'logs', 'access.log');
const ERROR_LOG_PATH = process.env.ERROR_LOG_PATH || path.join(__dirname, 'logs', 'error.log');

app.use(helmet());
app.use(cors(corsOpts));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer());

if (isProduction) {
  const accessLogStream = fs.createWriteStream(ACCESS_LOG_PATH, { flags: 'a' });
  const errorLogStream = fs.createWriteStream(ERROR_LOG_PATH, { flags: 'a' });

  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode >= 400,
    stream: accessLogStream }));

  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: errorLogStream
  }));
}

app.get('/health.json', healthCheck);

app.post('/diff', diff);

console.log(`
-------------
STARTING DIFFER SERVER 🎉
On Port: ${port}
-------------
`);

export default app.listen(port);
