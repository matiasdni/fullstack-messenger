import {
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

  declare users: NonAttribute<User>[] | User[];
  declare messages: NonAttribute<Message>[] | Message[];

  declare getUsers: HasManyGetAssociationsMixin<User>;
  declare getMessages: HasManyGetAssociationsMixin<Message>;

  declare addUser: HasManyCreateAssociationMixin<User, "id">;
  declare addMessage: HasManyCreateAssociationMixin<Message, "chat_id">;

  addUsers(userIds: string[]): Chat {
    userIds.map(async (id) => {
      return await User.findByPk(id).then((user) => {
        if (user) {
          return this.addUser(user);
        }
      });
    });
    return this;
  }
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
        type: DataTypes.STRING(64),
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
      tableName: "chat",
      sequelize,
    }
  );
};

export { Chat, initChat };
