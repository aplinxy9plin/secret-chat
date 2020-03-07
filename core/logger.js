import * as winston from 'winston';
// eslint-disable-next-line no-unused-vars
import * as rotate from 'winston-daily-rotate-file';
import * as fs from 'fs';
import config from './config';

const dir = config.logFileDir;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// eslint-disable-next-line new-cap
const logger = new winston.createLogger({
  level: 'info',
  transports: [
    new (winston.transports.Console)({
      colorize: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: config.logFileName,
      dirname: config.logFileDir,
      maxsize: 20971520, // 20MB
      maxFiles: 25,
      datePattern: '.dd-MM-yyyy',
    }),
  ],
});

export default logger;
