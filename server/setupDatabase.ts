import "./src/models/initModels";
import { createUser } from "./src/services/userService";
import { addUserToChat, createChat } from "./src/services/chatService";
import { createMessage } from "./src/services/messageService";
import { sequelize } from "./src/models/initModels";

async function main() {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sync the models with the database
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    // Create sample users
    const user1 = await createUser("test", "test");
    const user2 = await createUser("test2", "test");

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
    const anotherChat = await createChat(
      "Another Chat",
      "Another sample chat",
      "group"
    );

    // Add users to the another chat
    await addUserToChat(user1, anotherChat);
    await addUserToChat(user2, anotherChat);

    // Create sample messages in the another chat
    await createMessage("Welcome to another chat!", user1.id, anotherChat.id);
    await createMessage("Thanks for the invite!", user2.id, anotherChat.id);
    await createMessage(
      "Let's discuss something interesting!",
      user1.id,
      anotherChat.id
    );

    console.log("Sample data has been added to the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

main();
