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
        references: {
          model: User,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      chat_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: Chat,
          key: "id",
        },
        onDelete: "CASCADE",
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
