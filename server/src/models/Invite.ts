import {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
  NonAttribute,
} from "sequelize";
import { User } from "./initModels";
import { Chat } from "./initModels";

class Invite extends Model<
  InferAttributes<Invite>,
  InferCreationAttributes<Invite>
> {
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

const initInvites = (sequelize: Sequelize): typeof Invite => {
  const invite = Invite.init(
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
      tableName: "invite",
      underscored: true,
    }
  );
  return invite;
};

export { initInvites, Invite };
