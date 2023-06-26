import _ from "lodash";
import { addUserToChat, createChat } from "../services/chatService";
import friendService from "../services/friendService";
import { createMessage } from "../services/messageService";
import { createUser } from "../services/userService";
import { connectToDatabase, sequelize } from "./db";
import { Chat, User, UserFriends } from "../models";

// sample data with different real names and passwords
const sampleUsers = [
  { username: "Alice", password: "password1" },
  { username: "Alice01", password: "password2" },
  { username: "AliceInWonderland", password: "password3" },
  { username: "Alicia", password: "password4" },
  { username: "Alison", password: "password5" },
  { username: "Bob", password: "password6" },
  { username: "BobTheBuilder", password: "password7" },
  { username: "Bobby", password: "password8" },
  { username: "Charlie", password: "password9" },
  { username: "CharlieBrown", password: "password10" },
  { username: "Charlize", password: "password11" },
  { username: "Dave", password: "password12" },
  { username: "David", password: "password13" },
  { username: "DaveGrohl", password: "password14" },
  { username: "Eve", password: "password15" },
  { username: "Evelyn", password: "password16" },
  { username: "EveningStar", password: "password17" },
];

async function main() {
  try {
    await connectToDatabase();
    await sequelize.sync({ force: true });

    // destroy all data in the database
    await User.destroy({ where: {} });
    await Chat.destroy({ where: {} });

    // Create sample users
    const user1 = await createUser("test", "test");
    const user2 = await createUser("test2", "test");

    // add friends
    await UserFriends.bulkCreate([
      { userId: user1.id, friendId: user2.id },
      { userId: user2.id, friendId: user1.id },
    ]);

    const users = await User.bulkCreate(sampleUsers, {
      returning: true,
    });

    // add friends
    for (const user of users) {
      await UserFriends.bulkCreate([
        { userId: user1.id, friendId: user.id },
        { userId: user.id, friendId: user1.id },
        { userId: user2.id, friendId: user.id },
        { userId: user.id, friendId: user2.id },
      ]);
    }

    // accept friend requests
    await friendService.acceptFriendRequest(user1.id, user2.id);
    await friendService.acceptFriendRequest(user2.id, user1.id);

    for (let i = 0; i < _.floor((users.length / 5) * 3); i++) {
      try {
        await friendService.acceptFriendRequest(user1.id, users[i].id);
        await friendService.acceptFriendRequest(users[i].id, user1.id);
        await friendService.acceptFriendRequest(user2.id, users[i].id);
        await friendService.acceptFriendRequest(users[i].id, user2.id);
      } catch (error) {}
    }

    // Create the general chat
    const generalChat = await createChat(
      "General",
      "A general chat for all users",
      "group",
      user1.id
    );

    // Add users to the general chat
    await addUserToChat(user1, generalChat);
    await addUserToChat(user2, generalChat);
    await generalChat.addUsers(users);

    // Create sample messages in the general chat
    await createMessage("Hello, everyone!", user1.id, generalChat.id);
    await createMessage("Hey!", user2.id, generalChat.id);
    await createMessage("How is your day going?", user1.id, generalChat.id);

    // Create another chat
    const anotherChat: Chat = await createChat(
      "Another chat",
      "Another sample chat",
      "group",
      user2.id
    );

    // Add users to the another chat
    await addUserToChat(user1, anotherChat);
    await addUserToChat(user2, anotherChat);

    await createMessage("Welcome to another chat!", user1.id, anotherChat.id);
    await createMessage("Thanks for the invite!", user2.id, anotherChat.id);
    await createMessage(
      "Let's discuss something interesting!",
      user1.id,
      anotherChat.id
    );
    const anotherChat2 = await createChat(
      "test is not in this chat",
      "Anothe",
      "group",
      user2.id
    );

    const anotherChat3 = await createChat(
      "test2 is not in this chat",
      "Another sample c",
      "group",
      user1.id
    );

    await addUserToChat(user2, anotherChat2);
    await addUserToChat(user1, anotherChat3);

    // Create sample messages in the another chat

    console.log("Sample data has been added to the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

main();
