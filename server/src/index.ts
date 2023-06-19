import { server } from "./server";
import "./models";
import logger from "./utils/logger";
import { connectToDatabase } from "./utils/db";

const PORT = process.env.PORT || 3001;

connectToDatabase()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    logger.error(err);
  });
