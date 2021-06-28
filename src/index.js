require('dotenv').config();

const app = require('./app');
const db = require('./db')

const main = async() => {
  await app.listen(app.get('port'));
  console.log(`Server listening on port ${app.get('port')}`);
  db.connect().then(client => {
    console.log('connected');
    client.release();
  })
  .catch(err => console.error('error connecting', err.stack))
}

main();