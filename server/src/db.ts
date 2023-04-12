import { Sequelize } from "sequelize";
import { config } from "./config";
import { initUser, User } from "./models/user";
import { Group, initGroup } from "./models/group";
import { GroupMember, initGroupMember } from "./models/groupMember";
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
  initGroup(sequelize);
  initGroupMember(sequelize);
  initMessage(sequelize);

  User.hasMany(Message, { foreignKey: "user_id" });
  Message.belongsTo(User, { foreignKey: "user_id" });

  User.belongsToMany(Group, { through: GroupMember, foreignKey: "user_id" });
  Group.belongsToMany(User, { through: GroupMember, foreignKey: "group_id" });

  Group.hasMany(Message, { foreignKey: "group_id" });
  Message.belongsTo(Group, { foreignKey: "group_id" });

  await sequelize.sync();
  console.log("Database & tables created!");
};

export { sequelize, User, Group, GroupMember, Message };
