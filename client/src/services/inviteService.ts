import { Invite } from "features/invites/types";
import api from "services/api";
import { InviteAttributes } from "../../../shared/types";

const BASE_URL = "/invites";
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
