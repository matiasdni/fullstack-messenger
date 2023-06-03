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
  declare userId: ForeignKey<User["id"]>;
  declare chatId: ForeignKey<Chat["id"]>;

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
};

export { Message, initMessage };
