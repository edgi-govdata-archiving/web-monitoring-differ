
import db from './index';

db.sequelize.drop({ cascade: true }).then(() => {
  console.log('DB NUKED!!!');
  process.exit(0);
});
