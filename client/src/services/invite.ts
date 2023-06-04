import axios from "axios";
import { Invite } from "features/invites/types";
import { InviteAttributes } from "../../../shared/types";

const BASE_URL = "/api/invites";

export const createInvite = async (
  invite: {
    senderId: string;
    chatId: string;
    recipientId: string;
  },
  token: string
): Promise<InviteAttributes> => {
  const response = await axios.post(BASE_URL, invite, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getInvites = async (
  token: string
): Promise<InviteAttributes[]> => {
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// update invite status
export const updateInvite = async (
  invite: Invite,
  token: string
): Promise<InviteAttributes> => {
  const response = await axios.put(BASE_URL, invite, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteInvite = async (invite: Invite, token: string) => {
  const response = await axios.delete(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: invite,
  });
  if (response.status === 204) {
    return invite.id;
  } else {
    throw new Error("Error rejecting invite");
  }
};
