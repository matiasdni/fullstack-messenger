import { server } from "./server";
import "./models/initModels";
import { initModels } from "./models/initModels";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3001;

initModels()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(err);
  });
