import { Invite } from "features/invites/types";
import { InviteAttributes } from "../../../shared/types";
import api from "services/api";

const BASE_URL = "/invites";

export const createInvite = async (invite: {
  senderId: string;
  chatId: string;
  recipientId: string;
}): Promise<InviteAttributes> => {
  const response = await api.post(BASE_URL, invite);
  return response.data;
};

export const getInvites = async (): Promise<InviteAttributes[]> => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const updateInvite = async (
  invite: Invite
): Promise<InviteAttributes> => {
  const response = await api.put(BASE_URL, invite);
  return response.data;
};

export const deleteInvite = async (invite: Invite) => {
  const response = await api.delete(BASE_URL, { data: invite });
  if (response.status === 204) {
    return invite.id;
  }
};
