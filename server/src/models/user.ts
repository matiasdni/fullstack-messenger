import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { Message } from "./message";
import bcrypt from "bcrypt";
import { Chat } from "./chat";

class User extends Model {
  declare id: string;
  declare username: string;
  declare password: string;
  declare messages: NonAttribute<Message>[] | Message[];

  declare getMessages: HasManyGetAssociationsMixin<Message>;

  declare static associations: {
    messages: Association<User, Message>;
    chats: Association<User, Chat>;
  };

  declare getChats: HasManyGetAssociationsMixin<Chat>;

  public async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
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
        get(this: User) {
          const value = this.getDataValue("username");
          return value ? value.toLowerCase() : value;
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(this: User, value: string) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hash);
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
};

export { User, initUser };
