import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import dbConfigs from './sequelizeConfig.js';

const db = {
  config: dbConfigs[process.env.NODE_ENV || 'development'],
};

const configUrl = ({ database, host, password, port, useEnvVar, username }) => {
  return (process.env[useEnvVar])
  ? process.env[useEnvVar]
  : `postgres://${username}:${password}@${host}:${port}/${database}`;
};

db.config.url = configUrl(db.config);

const modelDir = path.join(__dirname, 'models');
const basename = path.basename(module.filename);

db.sequelize = new Sequelize(db.config.url, db.config);

// add all of the models to the db object
fs.readdirSync(modelDir)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = db.sequelize.import(path.join(modelDir, file));
    db[model.name] = model;
  });

// after all models have been added db, associate them
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
