import { DataTypes, ForeignKey, Model, Sequelize } from "sequelize";
import { User } from "./user";
import { Chat } from "./chat";

class UserChat extends Model {
  declare user_id: ForeignKey<string>;
  declare chat_id: ForeignKey<string>;
}

const initUserChat = (sequelize: Sequelize): void => {
  UserChat.init(
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      chat_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "user_chat",
      underscored: true,
      timestamps: false,
    }
  );
};

export { UserChat, initUserChat };
