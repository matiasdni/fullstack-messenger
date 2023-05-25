import {
  CreationOptional,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { User } from "./user";
import { Message } from "./message";
import { ForeignKey } from "sequelize";

class Chat extends Model {
  declare id: string;
  declare name: string;
  declare description: CreationOptional<string>;
  declare chat_type: "group" | "private";
  declare owner_id: ForeignKey<User["id"]>;

  declare users: NonAttribute<User>[] | User[];
  declare messages: NonAttribute<Message>[] | Message[];

  declare getUsers: HasManyGetAssociationsMixin<User>;
  declare getMessages: HasManyGetAssociationsMixin<Message>;

  declare createUser: HasManyCreateAssociationMixin<User, "id">;
  declare addMessage: HasManyCreateAssociationMixin<Message, "chat_id">;

  declare addUser: HasManyAddAssociationMixin<User, "id">;
  declare removeUser: HasManyRemoveAssociationMixin<User, "id">;

  async addUsers(userIds: string[]): Promise<Chat> {
    await Promise.all(
      userIds.map(async (id) => {
        return await User.findByPk(id).then((user) => {
          if (user) {
            return this.addUser(user);
          }
        });
      })
    );
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
        type: DataTypes.STRING(32),
        allowNull: true,
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
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
