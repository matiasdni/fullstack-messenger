import {
  CreationOptional,
  DataTypes,
  Model,
  Optional,
  Sequelize,
} from "sequelize";

interface InvitationAttributes {
  id: DataTypes.DataType;
  groupId: DataTypes.DataType;
  senderId: DataTypes.DataType;
  recipientId: DataTypes.DataType;
  status: DataTypes.EnumDataType<string>;
  createdAt: DataTypes.DateDataType;
  updatedAt: DataTypes.DateDataType;
}

interface InvitationCreationAttributes
  extends Optional<InvitationAttributes, "id"> {}

class Invitation extends Model<
  InvitationAttributes,
  InvitationCreationAttributes
> {
  declare id: CreationOptional<DataTypes.DataType>;
  declare senderId: DataTypes.DataType;
  declare groupId: DataTypes.DataType;
  declare receiverId: DataTypes.DataType;
  declare status: DataTypes.EnumDataType<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

const initInvitation = (sequelize: Sequelize): void => {
  Invitation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "chats",
          key: "id",
        },
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
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
};
