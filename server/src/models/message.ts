import { DataTypes, ForeignKey, Model } from "sequelize";
import { sequelize } from "../utils/db";
import { Chat, User } from "./index";

class Message extends Model {
  declare id: string;
  declare content: string;
  declare userId: ForeignKey<User["id"]>;
  declare chatId: ForeignKey<Chat["id"]>;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    content: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "message",
    sequelize,
    underscored: true,
  }
);

export default Message;
