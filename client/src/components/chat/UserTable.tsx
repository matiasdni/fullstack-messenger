import { Chat } from "@/features/chats/types";
import { User } from "@/features/users/types";
import { useUser } from "@/hooks/useAuth";

const UserTable = ({
  users,
  chat,
  handleUserRemoval,
}: {
  users: User[];
  chat: Chat;
  handleUserRemoval: (userId: string) => Promise<void>;
}) => {
  const currentUser = useUser();
  const usersWithStatus = users.map((user) => ({
    ...user,
    status: "online",
  }));
  return (
    <div className="h-64 overflow-auto scroll-smooth">
      <table className="table table-sm">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox dark:bg-gray-800" />
              </label>
            </th>
            <td>Username</td>
            <td>Status</td>
            <td>Member Since</td>
            <td></td>
          </tr>
        </thead>
        {/* rows*/}
        <tbody className="scroll-smooth">
          {usersWithStatus.map((user) => (
            <tr key={user.id}>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox dark:bg-gray-800"
                  />
                </label>
              </th>
              <td>
                <div className="flex items-center space-x-2 ">
                  <div className="avatar">
                    <div className="mask mask-circle w-10 h-10">
                      <img
                        src={`https://avatars.dicebear.com/api/identicon/${user.username}.svg`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {/* name */}
                    <p className="font-bold">{user.username}</p>
                    {/* member / invited */}
                    <p className="text-sm opacity-50">Member</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1">
                  <span
                    className={`badge badge-sm ${
                      user.status === "online" ? "badge-success" : "badge-ghost"
                    }`}
                  ></span>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </div>
              </td>
              <td>{new Date().toLocaleTimeString()}</td>
              <th>
                <button
                  className="btn btn-error btn-sm bg-rose-600 text-accent-content capitalize"
                  disabled={currentUser.id !== chat.ownerId}
                  onClick={() => handleUserRemoval(user.id)}
                >
                  Kick
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
