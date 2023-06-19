import User from "./user";

import Message from "./message";

import Chat from "./chat";

import UserChat from "./userChat";

import UserFriends from "./UserFriends";

import Invite from "./Invite";

User.hasMany(Message, { foreignKey: "userId", as: "messages" });
Message.belongsTo(User, { foreignKey: "userId", as: "user" });

Chat.belongsToMany(User, {
  through: UserChat,
  foreignKey: "chat_id",
  as: "users",
});
User.belongsToMany(Chat, {
  through: UserChat,
  foreignKey: "user_id",
  as: "chats",
});

UserFriends.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(UserFriends, { foreignKey: "userId", as: "userFriends" });

UserFriends.belongsTo(User, { foreignKey: "friendId", as: "friend" });
User.hasMany(UserFriends, { foreignKey: "friendId", as: "friends" });

Message.belongsTo(Chat, { foreignKey: "chatId" });
Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });

Invite.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });
Chat.hasMany(Invite, { foreignKey: "chatId", as: "invites" });

User.hasMany(Invite, { foreignKey: "recipientId", as: "invites" });
Invite.belongsTo(User, { foreignKey: "recipientId", as: "recipient" });

User.hasMany(Invite, { foreignKey: "senderId", as: "sentInvites" });
Invite.belongsTo(User, { foreignKey: "senderId", as: "sender" });

User.belongsTo(Chat, { foreignKey: "ownerId", as: "ownedChat" });
User.hasMany(Chat, { foreignKey: "ownedChats" });
Chat.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

UserChat.belongsTo(User, { foreignKey: "userId" });
User.hasMany(UserChat, { foreignKey: "userId" });
UserChat.belongsTo(Chat, { foreignKey: "chatId" });
Chat.hasMany(UserChat, { foreignKey: "chatId" });

// export models
export { User, Message, Chat, UserChat, UserFriends, Invite };
