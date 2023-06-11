import pino from "pino";

const transport = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    colorizeObjects: true,
    translateTime: "SYS:HH:MM:ss o dd-mm-yy",
    ignore: "pid,hostname",
    hideObject: false,
  },
});

const logger = pino(transport);
export default logger;
