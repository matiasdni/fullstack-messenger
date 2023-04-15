import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { User } from "./user";
import { Chat } from "./chat";

class Message extends Model<
  InferAttributes<Message>,
  InferCreationAttributes<Message>
> {
  declare id: string;
  declare content: string;
  declare user_id: ForeignKey<User["id"]>;
  declare chat_id: ForeignKey<Chat["id"]>;
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
      chat_id: {
        type: DataTypes.UUID,
      },
      user_id: {
        type: DataTypes.UUID,
      },
    },
    {
      modelName: "Message",
      sequelize,
    }
  );
};

export { Message, initMessage };
