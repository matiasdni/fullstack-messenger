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
      hooks: {
        afterCreate: async (userFriends, options) => {
          const friend = await UserFriends.findOne({
            where: {
              userId: userFriends.friendId,
              friendId: userFriends.userId,
            },
          });
          if (friend) {
            await friend.update({ status: "accepted" }, options);
            await userFriends.update({ status: "accepted" }, options);
          }
        },
      },
      sequelize,
      tableName: "user_friends",
      underscored: true,
    }
  );
};

export { UserFriends, initUserFriends };
