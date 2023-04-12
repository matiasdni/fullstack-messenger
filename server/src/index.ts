import http from "http";
import app from "./app";
import { connectToDatabase } from "./db";

const PORT = process.env.PORT || 3001;

connectToDatabase()
  .then(() => {
    console.log("Database connected");
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed", error);
  });
