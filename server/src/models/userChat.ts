import { DataTypes, ForeignKey, Model, Sequelize } from "sequelize";
import { User } from "./user";
import { Chat } from "./chat";

class UserChat extends Model {
  declare user_id: ForeignKey<User["id"]>;
  declare chat_id: ForeignKey<Chat["id"]>;
}

const initUserChat = (sequelize: Sequelize): void => {
  UserChat.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      chat_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      modelName: "UserChat",
      sequelize,
    }
  );
};

export { UserChat, initUserChat };
