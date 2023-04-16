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
    const user2 = await createUser("user2", "password2");

    // Create the general chat
    const generalChat = await createChat(
      "General",
      "A general chat for all users"
    );

    // Add users to the general chat
    await addUserToChat(user1, generalChat);
    await addUserToChat(user2, generalChat);


    // Create sample messages in the general chat
    await createMessage("Hello, everyone!", user1, generalChat);
    await createMessage("Hey!", user2, generalChat);
    await createMessage("How is your day going?", user1, generalChat);

    // Create another chat
    const anotherChat = await createChat("Another Chat", "Another sample chat");

    // Add users to the another chat
    await addUserToChat(user1, anotherChat);
    await addUserToChat(user2, anotherChat);
    console.log("user1", await user1.getChats());
    console.log("user1", await user1.getMessages());

    // Create sample messages in the another chat
    await createMessage("Welcome to another chat!", user1, anotherChat);
    await createMessage("Thanks for the invite!", user2, anotherChat);
    await createMessage(
      "Let's discuss something interesting!",
      user1,
      anotherChat
    );

    console.log("Sample data has been added to the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

main();
