import Mongoose from 'mongoose';
import logger from '../core/logger';
import config from '../core/config';

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
  const { dbHost, dbPort, dbName } = config;
  try {
    await Mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true });
    logger.info('Connected to mongo!!!');
  } catch (err) {
    logger.error('Could not connect to MongoDB');
  }
};

export default connectToDb;
