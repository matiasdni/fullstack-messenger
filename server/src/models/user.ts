import {
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from "sequelize";
import { Message } from "./message";
import bcrypt from "bcrypt";
import { Chat } from "./chat";
import { Invitation } from "./Invitation";

class User extends Model {
  declare id: string;
  declare username: string;
  declare password: string;

  declare getMessages: HasManyGetAssociationsMixin<Message>;
  declare getChats: HasManyGetAssociationsMixin<Chat>;
  declare getSentInvitations: HasManyGetAssociationsMixin<Invitation>;
  declare getReceivedInvitations: HasManyGetAssociationsMixin<Invitation>;

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
      sequelize,
      modelName: "User",
      tableName: "user",
      underscored: true,
      hooks: {
        beforeCreate: (user: User) => {
          user.password = bcrypt.hashSync(user.password, 10);
        },
      },
    }
  );
};

export { User, initUser };
