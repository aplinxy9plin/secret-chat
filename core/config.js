import path from 'path';

export default {
  logFileDir: path.join(__dirname, '../log'),
  logFileName: 'app.log',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://admin:q2w3e4r5@ds127736.mlab.com:27736/heroku_gtqj7p03',
  serverPort: process.env.PORT || 1335,
  secretKey: process.env.secretKey || 'qe2s2jHn0RF9I6CQhCYK',
};
