import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { Invite } from "./Invite";
import { Message } from "./message";
import { User } from "./user";

class Chat extends Model {
  declare id: string;
  declare name: string;
  declare description: CreationOptional<string>;
  declare chat_type: "group" | "private";
  declare ownerId: ForeignKey<User>;
  declare users: NonAttribute<User[]>;
  declare messages: NonAttribute<Message[]>;
  declare invites: NonAttribute<Invite[]>;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare getUsers: HasManyGetAssociationsMixin<User>;
  declare getMessages: HasManyGetAssociationsMixin<Message>;
  declare getInvites: HasManyGetAssociationsMixin<Invite>;

  declare createUser: HasManyCreateAssociationMixin<User, "id">;
  declare createMessage: HasManyCreateAssociationMixin<Message, "chatId">;

  declare addUser: HasManyAddAssociationMixin<User, "id">;
  declare removeUser: HasManyRemoveAssociationMixin<User, "id">;

  declare addInvites: HasManyAddAssociationMixin<Invite[], "id">;
  declare removeInvites: HasManyRemoveAssociationMixin<Invite[], "id">;

  async addUsers(users: User[]): Promise<Chat> {
    const transaction = await this.sequelize!.transaction();
    try {
      await Promise.all(
        users.map(async (user) => await this.addUser(user, { transaction }))
      );
      await transaction.commit();
      return this;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
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
