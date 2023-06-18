import bcrypt from "bcrypt";
import {
  CreationOptional,
  DataTypes,
  HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { Chat } from "./chat";
import { Message } from "./message";

class User extends Model {
  declare id: CreationOptional<string>;
  declare username: string;
  declare password: string;
  declare image: string | null;
  declare ownedChats: NonAttribute<Chat["id"]>;
  declare getMessages: HasManyGetAssociationsMixin<Message>;
  declare getChats: HasManyGetAssociationsMixin<Chat>;

  declare getOwnedChats: HasManyGetAssociationsMixin<Chat["id"]>;

  declare ownedChatsCount: HasManyCountAssociationsMixin;
  declare messagesCount: HasManyCountAssociationsMixin;
  declare chatsCount: HasManyCountAssociationsMixin;

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON(): Record<string, unknown> {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

const initUser = (sequelize: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Id cannot be null",
          },
          isUUID: {
            args: 4,
            msg: "Id must be a valid uuid",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: {
            args: [4, 32],
            msg: "Username must be between 4 and 32 characters",
          },
          notNull: {
            msg: "Username cannot be null",
          },
          isAlphanumeric: {
            msg: "Username must be alphanumeric",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4, 100],
            msg: "Password must be between 4 and 100 characters",
          },
          notNull: {
            msg: "Password cannot be null",
          },
        },
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeCreate: async (user: User) => {
          user.password = await bcrypt.hash(user.password!, 10);
        },
      },
      getterMethods: {
        ownedChatsCount() {
          return this.ownedChats?.length;
        },
        messagesCount() {
          return this.getMessages?.length;
        },
        chatsCount() {
          return this.getChats?.length;
        },
      },
      sequelize,
      tableName: "user",
      underscored: true,
    }
  );
};

export { User, initUser };
