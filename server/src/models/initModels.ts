import { Sequelize } from "sequelize";
import { Chat, initChat } from "./chat";
import { Pool } from "pg";
import { initUser, User } from "./user";
import { initMessage, Message } from "./message";
import { initUserChat, UserChat } from "./userChat";
import { config } from "../config";
import { initInvites, Invite } from "./Invite";
import { initUserFriends, UserFriends } from "./UserFriends";

const db: any = config.database;

const setupAssociations = (): void => {
  User.hasMany(Message, { foreignKey: "user_id", as: "messages" });
  Message.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Chat.belongsToMany(User, {
    through: UserChat,
    foreignKey: "chat_id",
    as: "users",
  });
  User.belongsToMany(Chat, {
    through: UserChat,
    foreignKey: "user_id",
    as: "chats",
  });

  User.belongsToMany(User, {
    as: "friends",
    foreignKey: "userId",
    through: UserFriends,
  });

  User.belongsToMany(User, {
    as: "userFriends",
    foreignKey: "friendId",
    through: UserFriends,
  });

  Message.belongsTo(Chat, { foreignKey: "chat_id" });
  Chat.hasMany(Message, { foreignKey: "chat_id", as: "messages" });

  Invite.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });
  Chat.hasMany(Invite, { foreignKey: "chatId", as: "invites" });

  User.hasMany(Invite, { foreignKey: "recipientId", as: "invites" });
  Invite.belongsTo(User, { foreignKey: "recipientId", as: "recipient" });

  User.hasMany(Invite, { foreignKey: "senderId", as: "sentInvites" });
  Invite.belongsTo(User, { foreignKey: "senderId", as: "sender" });
};

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: false,
  sync: {
    alter: true,
  },
});

const createDatabase = async (): Promise<void> => {
  const pool = new Pool({
    user: db.username,
    host: db.host,
    password: db.password,
    port: db.port,
  });

  try {
    console.log(`creating database ${db.database}`);
    await pool.query(`CREATE DATABASE ${db.database};`);
    console.log(`database ${db.database} created.`);
  } catch (err: any) {
    if (err.code === "42P04") {
      console.log(`database ${db.database} already exists.`);
    } else {
      console.error("error creating database", err);
      throw err;
    }
  } finally {
    await pool.end();
  }
};

const initModels = async (): Promise<void> => {
  await createDatabase();

  try {
    await sequelize.authenticate();
    console.log("connected to database");

    initChat(sequelize);
    initUser(sequelize);
    initMessage(sequelize);
    initUserChat(sequelize);
    initInvites(sequelize);
    initUserFriends(sequelize);

    setupAssociations();
  } catch (error) {
    console.error("connection error", error);
    throw error;
  }
};

export { initModels, sequelize, User, Message, Chat, Invite, UserChat };
