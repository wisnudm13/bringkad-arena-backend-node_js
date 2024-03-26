const winston = require("winston")

const customFormat = winston.format.combine(
    winston.format.timestamp(), winston.format.printf((info) => {
        return `${info.timestamp} - [${info.level.toUpperCase()}] - ${info.message}`
    }),
)

const errorLogger = winston.createLogger({
    format: customFormat,
    transports: [
      new winston.transports.File({ filename: "./logs/error.log", level: "error" }),
    ],
  });

const appLogger = winston.createLogger({
    format: customFormat,
    transports: [
      new winston.transports.File({ filename: "./logs/app.log", level: "info" }),
    ],
  });

const dblogger = winston.createLogger({
    level: "info",
    format: customFormat,
    transports: [
        new winston.transports.File({ filename: "./logs/db.log", level: "info" }),
    ],
});


module.exports = { 
    appLogger, 
    dblogger,
    errorLogger
};
