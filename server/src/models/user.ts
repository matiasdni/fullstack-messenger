import {
  Association,
  CreationOptional,
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
  declare id: CreationOptional<number>;
  declare username: string;
  declare password_hash: string;
  declare getMessages: HasManyGetAssociationsMixin<Message>;
  declare createMessage: HasManyCreateAssociationMixin<Message, "user_id">;

  declare static associations: {
    messages: Association<User, Message>;
  };

  declare messages: NonAttribute<Message>[] | Message[];

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

const initUser = (sequelize: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        get(this: User) {
          const value = this.getDataValue("id");
        },
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
        get(this: User) {
          const value = this.getDataValue("password_hash");
          return value ? value.toLowerCase() : value;
        },
        set(this: User, value: string) {
          this.setDataValue("password_hash", value.toLowerCase());
        },
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
