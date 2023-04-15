import http from "http";
import app from "./app";
import { connectToDatabase, Group, GroupMember, User } from "./db";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

const PORT = process.env.PORT || 3001;

connectToDatabase()
  .then(async () => {
    console.log("Database connected");

    // check if general group exists and create it if it doesn't
    const generalGroup = await Group.findOne({
      where: { name: "general", id: 1 },
    });

    if (!!generalGroup) {
      await Group.create({
        name: "general",
        description: "general chat",
        id: 1,
      });
    }
    const general = await Group.findOne({ where: { name: "general", id: 1 } });

    const users = await User.findAll();
    for (const user of users) {
      const groupMember = await GroupMember.findOne({
        where: { user_id: user.id, group_id: 1 },
      });
      if (!!groupMember) {
        await GroupMember.create({
          user_id: user.id,
          group_id: 1,
        });
        console.log("created group member", user.id, user.username);
      }
    }

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    const isValidToken = (token: string) => {
      const user: any = jwt.verify(token, process.env.JWT_SECRET!);
      return !!User.findOne(user);
    };

    io.on("connection", (socket: Socket) => {
      console.log("Client connected", socket.id);
      const token = socket.handshake.auth.token;

      // verify token
      if (isValidToken(token)) {
        socket.join("general");
      } else {
        socket.disconnect();
      }

      socket.on("message", (content) => {
        console.log(content);
        const message = {
          ...content,
          date: new Date(),
        };
        console.log(message);
        io.to("general").emit("message", message);
      });
    });

    io.on("disconnect", (socket: Socket) => {
      console.log("Client disconnected", socket.id);
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    console.log("server initialization failed");
  });
