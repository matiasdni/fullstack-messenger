import { Op } from "sequelize";
import { UserFriends } from "../models/UserFriends";
import { User, sequelize } from "../models/initModels";
import { ApiError } from "../utils/ApiError";

const friendService = {
  getFriends: async (userId: string) => {
    const friends = await UserFriends.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ userId }, { friendId: userId }],
          },
          {
            status: "accepted",
          },
        ],
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
    return friendsList.map((friend) => {
      return {
        id: friend.id as String,
        username: friend.username,
      };
    });
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
        id: friendRequest.friendId,
        friendId: friendRequest.friendId,
        userId: friendRequest.userId,
        username: friendRequest.user.username,
        status: friendRequest.status,
        createdAt: friendRequest.createdAt,
      };
    });

    return formattedFriendRequests;
  },
  sendFriendRequest: async (userId: string, friendId: string) => {
    const request = await UserFriends.findCreateFind({
      where: {
        userId,
        friendId,
      },
      defaults: {
        status: "pending",
      },
    });

    if (!request[1] && request[0].status === "pending") {
      throw new ApiError(403, "Friend request already sent");
    }
    const friendRequest = request[0];
    await friendRequest.reload({
      include: [
        {
          association: "friend",
          attributes: ["id", "username"],
        },
      ],
    });

    if (friendRequest.status === "rejected") {
      friendRequest.status = "pending";
      // todo: update timestamps, currently shows the time when the friend request was first sent
      await friendRequest.save();
    }

    const formattedFriendRequest = {
      id: friendRequest.friendId,
      friendId: friendRequest.friendId,
      userId: friendRequest.userId,
      username: friendRequest.friend.username,
      status: friendRequest.status,
      createdAt: friendRequest.createdAt,
    };
    return formattedFriendRequest;
  },
  getFriend: async (userId: string, friendId: string) => {
    const friend = await UserFriends.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    return friend;
  },
  acceptFriendRequest: async (userId: string, friendId: string) => {
    const t = await sequelize.transaction();

    try {
      const friendRequest = await UserFriends.findOne({
        where: {
          userId: friendId,
          friendId: userId,
        },
      });
      if (!friendRequest) {
        throw new Error("Friend request not found");
      }
      friendRequest.status = "accepted";
      await friendRequest.save({ transaction: t });

      const reverseFriendRequest = await UserFriends.findOne({
        where: {
          userId,
          friendId,
        },
      });
      if (reverseFriendRequest) {
        reverseFriendRequest.status = "accepted";
        await reverseFriendRequest.save({ transaction: t });
      }

      await t.commit();
      return friendRequest;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
  rejectFriendRequest: async (userId: string, friendId: string) => {
    const t = await sequelize.transaction();
    try {
      const friendRequest = await UserFriends.findOne({
        where: {
          userId: friendId,
          friendId: userId,
        },
      });
      if (!friendRequest) {
        throw new Error("Friend request not found");
      }
      friendRequest.status = "rejected";
      await friendRequest.save({ transaction: t });

      const reverseFriendRequest = await UserFriends.findOne({
        where: {
          userId,
          friendId,
        },
      });
      if (reverseFriendRequest) {
        reverseFriendRequest.status = "rejected";
        await reverseFriendRequest.save({ transaction: t });
      }

      await t.commit();
      return friendRequest;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  removeFriend: async (userId: string, friendId: string) => {
    const t = await sequelize.transaction();
    try {
      const friendRequests: UserFriends[] = await UserFriends.findAll({
        where: {
          [Op.or]: [
            { userId, friendId, status: "accepted" },
            { userId: friendId, friendId: userId, status: "accepted" },
          ],
        },
      });
      if (!friendRequests || friendRequests.length === 0) {
        throw new ApiError(404, "Friend not found");
      }
      // delete friend requests from both users
      await Promise.all(
        friendRequests.map((friendRequest) =>
          friendRequest.destroy({ transaction: t })
        )
      );
      await t.commit();

      // return the new friend lists of both users
      const friends = await friendService.getFriends(userId);
      const friendsOfFriend = await friendService.getFriends(friendId);

      return {
        [userId]: friends,
        [friendId]: friendsOfFriend,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
  getSentFriendRequests: async (userId: string) => {
    const friendRequests = await UserFriends.findAll({
      where: {
        userId,
        status: "pending",
      },
      include: [
        {
          association: "friend",
          attributes: ["id", "username"],
        },
      ],
    });

    const formattedFriendRequests = friendRequests.map((friendRequest) => {
      return {
        id: friendRequest.friendId,
        friendId: friendRequest.friendId,
        userId: friendRequest.userId,
        username: friendRequest.friend.username,
        status: friendRequest.status,
        createdAt: friendRequest.createdAt,
      };
    });

    return formattedFriendRequests;
  },
};

export default friendService;
