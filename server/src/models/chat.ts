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
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      modelName: "Chat",
      sequelize,
      scopes: {
        withUsers: {
          attributes: ["id", "name", "description", "updatedAt"],
          include: [
            {
              model: User,
              attributes: ["id", "username"],
              through: { attributes: [] },
            },
          ],
        },
        withMessages: {
          attributes: ["id", "name", "description", "updatedAt"],
          include: [
            {
              model: Message,
              attributes: ["id", "content", "createdAt"],
              order: [["createdAt", "DESC"]],
              include: [
                {
                  model: User,
                  attributes: ["username"],
                },
              ],
            },
          ],
        },
        withUsersAndMessages: {
          attributes: ["id", "name", "description", "updatedAt"],
          order: [["updatedAt", "DESC"]],
          include: [
            {
              model: User,
              attributes: ["id", "username"],
              through: { attributes: [] },
            },
            {
              model: Message,
              attributes: ["id", "content", "createdAt"],
              order: [["createdAt", "DESC"]],
              include: [
                {
                  model: User,
                  attributes: ["username"],
                },
              ],
            },
          ],
        },
      },
    }
  );
};

export { Chat, initChat };
