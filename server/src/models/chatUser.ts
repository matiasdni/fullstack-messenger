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

class ChatUser extends Model<
  InferAttributes<ChatUser>,
  InferCreationAttributes<ChatUser>
> {
  declare ChatId: ForeignKey<Chat["id"]>;
  declare UserId: ForeignKey<User["id"]>;
}

const initChatUser = (sequelize: Sequelize): void => {
  ChatUser.init(
    {
      UserId: {
        type: DataTypes.UUID,
      },
      ChatId: {
        type: DataTypes.UUID,
      },
    },
    {
      modelName: "ChatUser",
      sequelize,
    }
  );
};

export { ChatUser, initChatUser };
