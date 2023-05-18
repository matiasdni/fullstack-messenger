import { server } from "./server";
import "./models/initModels";
import { initModels } from "./models/initModels";

const PORT = process.env.PORT || 3001;

initModels()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
