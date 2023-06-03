import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { User } from "./initModels";

class UserFriends extends Model {
  declare userId: string;
  declare friendId: string;
  declare status: "pending" | "accepted" | "rejected";
  declare user: NonAttribute<User>;
  declare friend: NonAttribute<User>;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

const initUserFriends = (sequelize: Sequelize): void => {
  UserFriends.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      friendId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      tableName: "user_friends",
      underscored: true,
    }
  );
};

export { UserFriends, initUserFriends };
