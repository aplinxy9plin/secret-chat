import path from 'path';

export default {
  logFileDir: path.join(__dirname, '../log'),
  logFileName: 'app.log',
  dbHost: process.env.dbHost || 'localhost',
  dbPort: process.env.dbPort || '27017',
  dbName: process.env.dbName || 'secret-chat',
  serverPort: process.env.PORT || 1335,
  secretKey: process.env.secretKey || 'G9AiXcKQNhIZb9mZm9cZ',
};
