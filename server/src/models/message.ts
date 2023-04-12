import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { User } from "./user";
import { Group } from "./group";

class Message extends Model<
  InferAttributes<Message>,
  InferCreationAttributes<Message>
> {
  declare id: CreationOptional<number>;
  declare content: string;
  declare user_id: ForeignKey<User["id"]>;
  declare group_id: ForeignKey<Group["id"]>;
  declare created_at: CreationOptional<Date>;
}

const initMessage = (sequelize: Sequelize): void => {
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: new DataTypes.TEXT(),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      group_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      modelName: "Message",
      tableName: "messages",
      sequelize,
    }
  );
};

export { Message, initMessage };
