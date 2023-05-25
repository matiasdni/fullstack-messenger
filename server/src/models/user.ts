import {
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  NonAttribute,
  CreationOptional,
  Sequelize,
} from "sequelize";
import { Message } from "./message";
import bcrypt from "bcrypt";
import { Chat } from "./chat";

class User extends Model {
  declare id: CreationOptional<string>;
  declare username: string;
  declare password: string;

  declare chats: NonAttribute<User>[] | User[];
  declare messages: NonAttribute<Message>[] | Message[];
  declare getMessages: HasManyGetAssociationsMixin<Message>;
  declare getChats: HasManyGetAssociationsMixin<Chat>;

  comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
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
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user: User) => {
          user.password = await bcrypt.hash(user.password, 10);
        },
      },
      sequelize,
      tableName: "user",
      underscored: true,
    }
  );
};

export { User, initUser };
