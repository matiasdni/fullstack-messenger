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

class Invitation extends Model<
  InferAttributes<Invitation>,
  InferCreationAttributes<Invitation>
> {
  declare id: CreationOptional<string>;
  declare status: CreationOptional<string>;
  declare senderId: ForeignKey<User["id"]>;
  declare groupId: ForeignKey<Chat["id"]>;
  declare recipientId: ForeignKey<User["id"]>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

const initInvitation = (sequelize: Sequelize): typeof Invitation =>
  Invitation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "accepted", "declined"],
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
      tableName: "invitations",
      underscored: true,
    }
  );

export { initInvitation, Invitation };
