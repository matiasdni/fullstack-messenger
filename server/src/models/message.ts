import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from "sequelize";
import { User } from "./user";
import { Chat } from "./chat";

class Message extends Model {
  declare id: string;
  declare content: string;
  declare user_id: ForeignKey<User["id"]>;
  declare chat_id: ForeignKey<Chat["id"]>;

  declare getUser: BelongsToGetAssociationMixin<User>;
  declare setUser: BelongsToCreateAssociationMixin<User>;

  declare getChat: BelongsToGetAssociationMixin<Chat>;
  declare setChat: BelongsToCreateAssociationMixin<Chat>;
}

const initMessage = (sequelize: Sequelize): void => {
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      chat_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Chat,
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      modelName: "Message",
      tableName: "message",
      sequelize,
      underscored: true,
    }
  );
};

export { Message, initMessage };
