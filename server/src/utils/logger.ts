import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss dd-mm yyyy ",
      ignore: "pid,hostname",
      hideObject: false,
      messageFormat: false,
      
    },
  },
});

export default logger;
