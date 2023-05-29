import axios from "axios";
import { InviteAttributes } from "../../../shared/types";
import { Invite } from "src/features/invites/types";

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
