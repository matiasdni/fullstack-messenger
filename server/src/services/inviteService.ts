import {
  Chats,
  CreateInviteInput,
  GetPendingInvitesInput,
  GetPendingInvitesOutput,
  InviteAttributes,
  RejectInviteInput,
  Sender,
  Senders,
  Status,
  TChat,
} from "../../../shared/types";
import { Invite, User } from "../models";
import { ApiError } from "../utils/ApiError";

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

// inviteId: The id of the invite to accept or reject.
// userId: The id of the user who is accepting or rejecting the invite.
const updateInvite = async (
  updatedInvite: any,
  user: any
): Promise<InviteAttributes> => {
  const invite = await Invite.findOne({
    where: {
      id: updatedInvite.id,
      recipientId: user.id,
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
  });

  if (!invite) {
    throw new ApiError(404, "invite not found or already accepted/rejected");
  }

  console.log("invite", invite.toJSON(), "updatedInvite", updatedInvite);

  if (
    !(
      updatedInvite.status === "accepted" || updatedInvite.status === "rejected"
    )
  ) {
    throw new ApiError(400, "invalid invite status");
  }
  await invite.update({ status: updatedInvite.status });

  return invite.toJSON() as InviteAttributes;
};

const rejectInvite = async ({
  inviteId,
  userId,
}: RejectInviteInput): Promise<void> => {
  // delete invite from database if it exists for now. Later implement a way to view rejected invites maybe?
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

  await invite.destroy();
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

  const inviteAttributes = invites.map((invite: any) => ({
    id: invite.id,
    status: invite.status as Status,
    senderId: invite.senderId,
    chatId: invite.chatId,
    recipientId: invite.recipientId,
    createdAt: invite.createdAt,
    updatedAt: invite.updatedAt,
  }));

  const senders = invites.reduce((acc: any, invite: any) => {
    acc[invite.senderId] = invite.sender.toJSON() as Sender;
    return acc;
  }, {} as Senders);

  const chats = invites.reduce((acc: any, invite: any) => {
    acc[invite.chatId] = invite.chat.toJSON() as TChat;
    return acc;
  }, {} as Chats);

  return { invites: inviteAttributes, senders, chats };
};

export { createInvite, getPendingInvites, rejectInvite, updateInvite };
