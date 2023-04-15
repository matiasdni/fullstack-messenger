import {
  Association,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { Message } from "./message";
import bcrypt from "bcrypt";

class User extends Model<
  InferAttributes<User, { omit: "messages" }>,
  InferCreationAttributes<
    User,
    {
      omit: "messages";
    }
  >
> {
  declare id: string;
  declare username: string;
  declare password_hash: string;
  declare getMessages: HasManyGetAssociationsMixin<Message>;
  declare createMessage: HasManyCreateAssociationMixin<Message, "user_id">;

  declare static associations: {
    messages: Association<User, Message>;
  };

  declare messages: NonAttribute<Message>[] | Message[];

  public async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password_hash);
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
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user: User) => {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        },
      },
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
};

export { User, initUser };
