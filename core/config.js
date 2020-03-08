import path from 'path';

export default {
  logFileDir: path.join(__dirname, '../log'),
  logFileName: 'app.log',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/secret123',
  serverPort: process.env.PORT || 1335,
  secretKey: process.env.secretKey || 'G9AiXcKQNhIZb9mZm9cZ',
};
