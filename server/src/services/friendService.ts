import { Op } from "sequelize";
import { UserFriends } from "../models/UserFriends";
import { User } from "../models/initModels";

const friendService = {
  getFriends: async (userId: string) => {
    const friends = await UserFriends.findAll({
      where: {
        [Op.or]: [{ userId }, { friendId: userId }],
        status: "accepted",
      },
    });

    const friendIds = friends.map((friend) => {
      if (friend.userId === userId) {
        return friend.friendId;
      }
      return friend.userId;
    });
    const friendsList = await User.findAll({
      where: {
        id: {
          [Op.in]: friendIds,
        },
      },
      attributes: ["id", "username"],
    });
    return friendsList;
  },
  getFriendRequests: async (userId: string) => {
    const friendRequests = await UserFriends.findAll({
      where: {
        friendId: userId,
        status: "pending",
      },
      include: [
        {
          association: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    const formattedFriendRequests = friendRequests.map((friendRequest) => {
      return {
        userId: friendRequest.userId,
        username: friendRequest.user.username,
        status: friendRequest.status,
        createdAt: friendRequest.createdAt,
      };
    });

    return formattedFriendRequests;
  },
  sendFriendRequest: async (userId: string, friendId: string) => {
    const friendRequest = await UserFriends.create({
      userId,
      friendId,
    });
    return friendRequest;
  },
};

export default friendService;
