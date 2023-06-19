import { getChatIds } from "../services/userChatService";
import logger from "../utils/logger";
import { mySocket } from "./types";

// connected clients, user id is the key for the socket. Multiple sockets can be connected to the same user.
// Use lodash for mapping sockets to user ids for easier access
const connectedClients: { [key: string]: mySocket[] } = {};

const setupSocketHandler = (socket: mySocket) => {
  const user = socket.user;
  if (!user) {
    return;
  }
  connectedClients[user.id] = connectedClients[user.id] || [];
  connectedClients[user.id].push(socket);
  logger.info(`User ${socket.user?.username} connected`);

  const uniqueUsers = Object.keys(connectedClients);

  logger.info(`Number of connected users: ${uniqueUsers.length}`);

  socket.join(socket.user!.id);
  // join user chat rooms
  getChatIds(socket.user!.id).then((ids: string[]) => {
    ids.forEach((id) => {
      socket.join(id);
    });
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.user?.username}`);
    const sockets = connectedClients[user.id];
    const index = sockets.indexOf(socket);
    if (index > -1) {
      sockets.splice(index, 1);
    }

    if (sockets.length === 0) {
      delete connectedClients[user.id];
    }

    socket.disconnect();
  });
};

export default setupSocketHandler;

export { connectedClients };
