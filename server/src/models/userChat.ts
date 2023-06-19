import { DataTypes, ForeignKey, Model } from "sequelize";
import { sequelize } from "../utils/db";

class UserChat extends Model {
  declare user_id: ForeignKey<string>;
  declare chat_id: ForeignKey<string>;
}

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

export default UserChat;
