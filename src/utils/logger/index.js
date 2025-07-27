import winston, { createLogger, transports, format } from "winston";
const { combine, label, printf, timestamp } = format;

import "winston-daily-rotate-file";
const logFolderPath = "./logs/application_logs";
const myFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} ${label} ${level}:${message}`
);
export const logger = createLogger({
  level: "info",
  format: combine(label({ label: "right meow" }), timestamp(), myFormat),
  silent: false,

  transports: [
    new transports.DailyRotateFile({
      filename: "application-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      dirname: logFolderPath,
    }),
    new winston.transports.DailyRotateFile({
      level: "error",
      filename: "application-error-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      dirname: logFolderPath,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: myFormat,
    })
  );
}
