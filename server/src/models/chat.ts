import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { User } from "./user";
import { Message } from "./message";

class Chat extends Model {
  declare id: string;
  declare name: string;
  declare description: CreationOptional<string>;
  declare chat_type: "private" | "group";

  declare static associations: {
    users: Association<Chat, User>;
    messages: Association<Chat, Message>;
  };

  declare users: NonAttribute<User>[] | User[];
  declare messages: NonAttribute<Message>[] | Message[];

  declare getUsers: HasManyGetAssociationsMixin<User>;
  declare getMessages: HasManyGetAssociationsMixin<Message>;

  declare addUser: HasManyCreateAssociationMixin<User, "id">;
  declare addMessage: HasManyCreateAssociationMixin<Message, "chat_id">;
}

const initChat = (sequelize: Sequelize): void => {
  Chat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(16),
        allowNull: true,
        validate: {
          isPrivateGroup(value: string) {
            if (this.chat_type === "group" && value === null) {
              throw new Error("Group chat must have a name");
            }
          },
        },
      },
      description: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      chat_type: {
        type: DataTypes.ENUM,
        values: ["private", "group"],
        allowNull: false,
        defaultValue: "private",
      },
    },
    {
      modelName: "Chat",
      sequelize,
    }
  );
};

export { Chat, initChat };
