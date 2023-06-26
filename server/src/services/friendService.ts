import { CreationOptional, Op } from "sequelize";
import { User, UserFriends } from "../models";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";
import { sequelize } from "../utils/db";

const findAllWithId = (userId: string, friendId: string, ...args: any) => {
  // args is an object so need to format it to match the signature of findAll
  const options = args[0];
  const { where, ...rest } = options;
  const newWhere = {
    ...where,
    [Op.or]: [
      {
        userId,
        friendId,
      },
      {
        userId: friendId,
        friendId: userId,
      },
    ],
  };
  return UserFriends.findAll({ ...rest, where: newWhere });
};

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

    const friendIds = friends.map((friend: any) => {
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
    return friendsList.map((friend: any) => {
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

    return friendRequests.map((friendRequest: any) => ({
      id: friendRequest.friendId,
      friendId: friendRequest.friendId,
      userId: friendRequest.userId,
      username: friendRequest.user.username,
      status: friendRequest.status,
      createdAt: friendRequest.createdAt,
    }));
  },
  sendFriendRequest: async (userId: string, friendId: string) => {
    const request = await UserFriends.findCreateFind({
      where: {
        userId,
        friendId,
      },
      include: [
        {
          association: "friend",
          attributes: ["id", "username"],
        },
      ],
    });
    const friendRequest = request[0];

    await friendRequest.reload({
      include: [
        {
          association: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    const sender = await User.findByPk(friendId, {
      attributes: ["id", "username", "image"],
    });
    logger.info(`sender ${JSON.stringify(await sender!.toJSON())}`);
    const receiver = await User.findByPk(userId, {
      attributes: ["id", "username", "image"],
    });
    logger.info(`receiver ${JSON.stringify(await receiver!.toJSON())}`);

    if (friendRequest.status === "pending") {
      return {
        id: friendRequest.friendId,
        friendId: friendRequest.friendId,
        userId: friendRequest.userId,
        username: receiver!.username,
        status: friendRequest.status,
        createdAt: friendRequest.createdAt,
      };
    }

    if (friendRequest.status === "accepted") {
      // check if user is already a friend from the user instance
      const user = await User.findByPk(userId, {
        include: [
          {
            association: "friends",
            attributes: ["id"],
          },
        ],
      });

      logger.info(user);
      throw new ApiError(400, "Already friends");
    }

    friendRequest.status = "pending";
    await friendRequest.save();

    await friendRequest.reload({
      include: [
        {
          association: "friend",
          attributes: ["id", "username"],
        },
      ],
    });

    return {
      id: friendRequest.friendId,
      friendId: friendRequest.friendId,
      userId: friendRequest.userId,
      username: friendRequest.friend.username,
      status: friendRequest.status,
      createdAt: friendRequest.createdAt,
    };
  },
  getFriend: async (userId: string, friendId: string) => {
    return await UserFriends.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
  },
  acceptFriendRequest: async (userId: string, friendId: string) => {
    const friendRequests = await findAllWithId(userId, friendId, {
      status: "pending",
    });
    if (!friendRequests || friendRequests.length === 0) {
      throw new ApiError(404, "Friend request not found");
    }
    await Promise.all(
      friendRequests.map(async (friendRequest: any) => {
        friendRequest.status = "accepted";
        await friendRequest.save();
      })
    );

    const friendLists = await Promise.all([
      friendService.getFriends(userId),
      friendService.getFriends(friendId),
    ]);

    const friendRequestLists = await Promise.all([
      friendService.getFriendRequests(userId),
      friendService.getFriendRequests(friendId),
    ]);

    const sentFriendRequestLists = await Promise.all([
      friendService.getSentFriendRequests(userId),
      friendService.getSentFriendRequests(friendId),
    ]);
    return {
      [userId]: {
        friends: friendLists[0],
        friendRequests: friendRequestLists[0],
        sentFriendRequestLists: sentFriendRequestLists[0],
      },
      [friendId]: {
        friends: friendLists[1],
        friendRequests: friendRequestLists[1],
        sentFriendRequestLists: sentFriendRequestLists[1],
      },
    };
  },
  rejectFriendRequest: async (userId: string, friendId: string) => {
    const t = await sequelize.transaction();
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
    try {
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
    const friendRequests: UserFriends[] = await UserFriends.findAll({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    if (!friendRequests || friendRequests.length === 0) {
      throw new ApiError(404, "Friend not found");
    }

    try {
      // delete friend requests from both users
      await UserFriends.destroy({
        where: {
          [Op.or]: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
          ],
        },
        transaction: t,
      });
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

    return friendRequests.map((friendRequest: any) => {
      return {
        id: friendRequest.friendId,
        friendId: friendRequest.friendId,
        userId: friendRequest.userId,
        username: friendRequest.friend.username,
        status: friendRequest.status,
        createdAt: friendRequest.createdAt,
      };
    });
  },
  removeUser(id: CreationOptional<string>) {
    return User.destroy({
      where: {
        id,
      },
    });
  },
};

export default friendService;
