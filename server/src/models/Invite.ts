import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { User } from "./user";
import { Chat } from "./chat";

class Invite extends Model<
  InferAttributes<Invite>,
  InferCreationAttributes<Invite>
> {
  declare id: CreationOptional<string>;
  declare status: CreationOptional<string>;
  declare sender_id: ForeignKey<User["id"]>;
  declare chat_id: ForeignKey<Chat["id"]>;
  declare recipient_id: ForeignKey<User["id"]>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

const initInvitation = (sequelize: Sequelize): typeof Invite =>
  Invite.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
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

export { initInvitation, Invite };
