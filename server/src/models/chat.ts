import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  Model,
  NonAttribute,
} from "sequelize";
import { ApiError } from "../utils/ApiError";
import { sequelize } from "../utils/db";
import { Invite, Message, User } from "./index";

class Chat extends Model {
  declare id: string;
  declare name: string;
  declare description: CreationOptional<string>;
  declare chat_type: "group" | "private";
  declare image: string | null;
  declare ownerId: ForeignKey<User["id"]>;
  declare users: NonAttribute<User[]>;
  declare messages: NonAttribute<Message[]>;
  declare invites: NonAttribute<Invite[]>;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare getUsers: HasManyGetAssociationsMixin<User>;

  declare addUser: HasManyAddAssociationMixin<User, "id">;
  declare removeUser: HasManyRemoveAssociationMixin<User, "id">;

  declare addInvites: HasManyAddAssociationMixin<Invite[], "id">;

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

Chat.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,

      validate: {
        isUUID: {
          args: 4,
          msg: "id must be a valid uuid",
        },
        notNull: {
          msg: "id cannot be null",
        },
      },
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
    },
    chat_type: {
      type: DataTypes.ENUM,
      values: ["private", "group"],
      allowNull: false,
      defaultValue: "private",
      validate: {
        isIn: [["private", "group"]],
      },
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    validate: {
      async ownerExists() {
        if (this.ownerId) {
          const user = await User.findByPk(this.ownerId.toString());
          if (!user) {
            throw new ApiError(400, "Owner does not exist");
          }
        }
      },
    },

    tableName: "chat",
    sequelize,
  }
);

export default Chat;
