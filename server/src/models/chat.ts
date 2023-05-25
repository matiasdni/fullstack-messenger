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
import { Invite } from "./Invite";

class Chat extends Model {
  declare id: string;
  declare name: string;
  declare description: CreationOptional<string>;
  declare chat_type: "group" | "private";

  declare users: NonAttribute<User>[];
  declare messages: NonAttribute<Message>[];
  declare invites: NonAttribute<Invite>[];

  declare getUsers: HasManyGetAssociationsMixin<User>;
  declare getMessages: HasManyGetAssociationsMixin<Message>;

  declare createUser: HasManyCreateAssociationMixin<User, "id">;
  declare addMessage: HasManyCreateAssociationMixin<Message, "chat_id">;

  declare addUser: HasManyAddAssociationMixin<User, "id">;
  declare removeUser: HasManyRemoveAssociationMixin<User, "id">;

  declare addInvites: HasManyAddAssociationMixin<Invite[], "id">;
  declare removeInvites: HasManyRemoveAssociationMixin<Invite[], "id">;

  async addUsers(users: User[]): Promise<Chat> {
    await Promise.all(users.map(async (user) => await this.addUser(user)));
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
    },
    {
      tableName: "chat",
      sequelize,
    }
  );
};

export { Chat, initChat };
