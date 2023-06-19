import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../utils/db";
import { Chat, User } from "./index";

class Invite extends Model {
  declare id: CreationOptional<string>;
  declare status: CreationOptional<"pending" | "accepted" | "rejected">;
  declare senderId: ForeignKey<User["id"]>;
  declare chatId: ForeignKey<Chat["id"]>;
  declare recipientId: ForeignKey<User["id"]>;

  declare sender: NonAttribute<User>;
  declare chat: NonAttribute<Chat>;
  declare recipient: NonAttribute<User>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Invite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      values: ["pending", "accepted", "rejected"],
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "invites",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
    underscored: true,
  }
);

export default Invite;
