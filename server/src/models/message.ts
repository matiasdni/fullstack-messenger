import {
  Association,
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

  declare static associations: {
    user: Association<Message, User>;
    chat: Association<Message, Chat>;
  };
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
      },
      chat_id: {
        type: DataTypes.UUID,
      },
    },
    {
      modelName: "Message",
      sequelize,
    }
  );
};

export { Message, initMessage };
