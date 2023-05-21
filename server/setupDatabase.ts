import "./src/models/initModels";
import { createUser } from "./src/services/userService";
import { addUserToChat, createChat } from "./src/services/chatService";
import { createMessage } from "./src/services/messageService";
import { Chat, initModels, sequelize, User } from "./src/models/initModels";

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
    await initModels();
    await sequelize.sync({ force: true });

    // Create sample users
    const user1 = await createUser("test", "test");
    const user2 = await createUser("test2", "test");

    const users = await User.bulkCreate(sampleUsers, {
      returning: true,
    });

    // Create the general chat
    const generalChat = await createChat(
      "General",
      "A general chat for all users",
      "group"
    );

    // Add users to the general chat
    await addUserToChat(user1, generalChat);
    await addUserToChat(user2, generalChat);

    // Create sample messages in the general chat
    await createMessage("Hello, everyone!", user1.id, generalChat.id);
    await createMessage("Hey!", user2.id, generalChat.id);
    await createMessage("How is your day going?", user1.id, generalChat.id);

    // Create another chat
    const anotherChat: Chat = await createChat(
      "Another chat",
      "Another sample chat",
      "group"
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
      "group"
    );

    const anotherChat3 = await createChat(
      "test2 is not in this chat",
      "Another sample c",
      "group"
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
