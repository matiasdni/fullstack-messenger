import { DataTypes, Model } from "sequelize";

class UserFriends extends Model {
  declare userId: string;
  declare friendId: string;
}

const initUserFriends = (sequelize: any): void => {
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
    },
    {
      sequelize,
      tableName: "user_friends",
      underscored: true,
      timestamps: false,
    }
  );
};

export { UserFriends, initUserFriends };
