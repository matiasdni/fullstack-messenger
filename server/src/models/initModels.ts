import { Sequelize } from "sequelize";
import { Chat, initChat } from "./chat";
import { initUser, User } from "./user";
import { initMessage, Message } from "./message";
import { initUserChat, UserChat } from "./userChat";
import { config } from "../config";

const db: any = config.database;

const setupAssociations = (): void => {
  User.hasMany(Message, { foreignKey: "user_id" });
  Message.belongsTo(User, { foreignKey: "user_id" });

  Chat.belongsToMany(User, { through: UserChat, foreignKey: "chat_id" });
  User.belongsToMany(Chat, { through: UserChat, foreignKey: "user_id" });

  Message.belongsTo(Chat, { foreignKey: "chat_id" });
  Chat.hasMany(Message, { foreignKey: "chat_id" });
};

const initModels = (sequelize: Sequelize): void => {
  initChat(sequelize);
  initUser(sequelize);
  initMessage(sequelize);
  initUserChat(sequelize);

  setupAssociations();
};

export const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: false,
  sync: {},
});

initModels(sequelize);
