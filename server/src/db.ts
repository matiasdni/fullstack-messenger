import { Sequelize } from "sequelize";
import { config } from "./config";
import { initUser, User } from "./models/user";
import { Chat, initChat } from "./models/chat";
import { ChatUser, initChatUser } from "./models/chatUser";
import { initMessage, Message } from "./models/message";

const env: string = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
  }
);

export const connectToDatabase = async () => {
  initUser(sequelize);
  initChat(sequelize);
  initChatUser(sequelize);
  initMessage(sequelize);

  // User.hasMany(Message, {
  //   sourceKey: "id",
  //   foreignKey: "user_id",
  //   as: "messages",
  // });
  //
  // Message.belongsTo(User, {
  //   as: "user",
  // });
  //
  // Chat.hasMany(Message, {
  //   sourceKey: "id",
  //   foreignKey: "chat_id",
  //   as: "messages",
  // });
  //
  // Message.belongsTo(Chat, {
  //   as: "chat",
  // });
  //
  // Chat.belongsToMany(User, {
  //   through: ChatUser,
  //   as: "users",
  //   foreignKey: "ChatId",
  //   otherKey: "UserId",
  // });
  //
  // User.belongsToMany(Chat, {
  //   through: ChatUser,
  //   as: "chats",
  //   foreignKey: "UserId",
  //   otherKey: "ChatId",
  // });

  // User.associations = {
  //   chats: {
  //       associationType: "BelongsToMany",
  //       source: User,
  //       target: Chat,
  //   options: {
  //       through: ChatUser,
  //       as: "chats",
  //       foreignKey: "UserId",
  //       otherKey: "ChatId",
  //   }
  //   }
  //   };



  await sequelize.sync({ force: true});
  console.log("Database & tables created!");

  const user = await User.create({
    username: "test",
    password_hash: "test",
  });

    const chat = await Chat.create({
    name: "test",
    });
    const message = await Message.create({
        content: "test",
        user_id: user.id,
        chat_id: chat.id,
    });
    console.log("Message created!", message.toJSON());

    // await user.$add("chats", chat);
  console.log("User created!", user.toJSON());
    console.log("Chat created!", chat.toJSON());

};

export { sequelize, User, Chat, ChatUser, Message };
