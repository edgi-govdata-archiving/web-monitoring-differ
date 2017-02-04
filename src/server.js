
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

import healthCheck from './HealthCheck';

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

console.log(`
-------------
STARTING DIFFER SERVER 🎉
On Port: ${port}
-------------
`);

export default app.listen(port);
