
import db from './index';

const sequelizeFixtures = require('sequelize-fixtures');

db.sequelize.sync().then(() => {
  console.log('CREATED SCHEMA...');

  sequelizeFixtures.loadFiles([
  ], db).then(() => {
    console.log('CREATED FIXTURES!');
    process.exit(0);
  });
});
