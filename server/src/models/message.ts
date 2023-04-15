import {
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
  declare id: string;
  declare content: string;
  declare user_id: ForeignKey<User["id"]>;
  declare group_id: ForeignKey<Group["id"]>;
}

const initMessage = (sequelize: Sequelize): void => {
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
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
        type: DataTypes.INTEGER,
        allowNull: false,
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
