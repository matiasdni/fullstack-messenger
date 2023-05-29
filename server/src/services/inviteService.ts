import { Invite } from "../models/initModels";
import {
  CreateInviteInput,
  InviteAttributes,
  AcceptInviteInput,
  RejectInviteInput,
  GetPendingInvitesInput,
  GetPendingInvitesOutput,
  Status,
  Sender,
  Senders,
  TChat,
  Chats,
} from "../../../shared/types";

// senderId: The id of the user who is sending the invite.
// chatId: The id of the chat to invite the user to.
// recipientId: The id of the user who is being invited.
const createInvite = async ({
  senderId,
  chatId,
  recipientId,
}: CreateInviteInput): Promise<InviteAttributes> => {
  const invite = await Invite.create({
    senderId: senderId,
    chatId: chatId,
    recipientId: recipientId,
  });

  return invite.toJSON() as InviteAttributes;
};

// inviteId: The id of the invite to accept.
// userId: The id of the user who is accepting the invite.
const acceptInvite = async ({
  inviteId,
  userId,
}: AcceptInviteInput): Promise<void> => {
  const invite = await Invite.findOne({
    where: {
      id: inviteId,
      recipientId: userId,
      status: "pending",
    },
  });

  if (!invite) {
    throw new Error("invite not found or already accepted/rejected");
  }

  await invite.update({ status: "accepted" });
};

// inviteId: The id of the invite to reject.
// userId: The id of the user who is rejecting the invite.
const rejectInvite = async ({
  inviteId,
  userId,
}: RejectInviteInput): Promise<void> => {
  const invite = await Invite.findOne({
    where: {
      id: inviteId,
      recipientId: userId,
      status: "pending",
    },
  });

  if (!invite) {
    throw new Error("invite not found or already accepted/rejected");
  }

  await invite.update({ status: "rejected" });
};

// userId: The id of the user whose pending invites to get.
const getPendingInvites = async ({
  userId,
}: GetPendingInvitesInput): Promise<GetPendingInvitesOutput> => {
  const invites = await Invite.findAll({
    where: {
      recipientId: userId,
      status: "pending",
    },
    include: [
      {
        association: "sender",
        attributes: ["id", "username"],
      },
      {
        association: "chat",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const inviteAttributes = invites.map((invite) => ({
    id: invite.id,
    status: invite.status as Status,
    senderId: invite.senderId,
    chatId: invite.chatId,
    recipientId: invite.recipientId,
    createdAt: invite.createdAt,
    updatedAt: invite.updatedAt,
  }));

  const senders = invites.reduce((acc, invite) => {
    acc[invite.senderId] = invite.sender.toJSON() as Sender;
    return acc;
  }, {} as Senders);

  const chats = invites.reduce((acc, invite) => {
    acc[invite.chatId] = invite.chat.toJSON() as TChat;
    return acc;
  }, {} as Chats);

  return { invites: inviteAttributes, senders, chats };
};

export { createInvite, acceptInvite, rejectInvite, getPendingInvites };
