const AvatarStack = ({ users }) => (
  <div className="flex -space-x-2 overflow-hidden">
    {users.slice(0, 3).map((user) => (
      <div key={user.id}>
        <img
          className={
            "inline-block w-8 h-8 rounded-full ring-2 ring-white bg-current dark:bg-gray-400 dark:ring-gray-800"
          }
          src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${user.username}`}
          alt=""
        />
      </div>
    ))}
    <div
      className={`flex items-center justify-center rounded-full ring-2 ring-white ${
        users?.length - 3 > 0 ? "visible" : "hidden"
      }`}
    >
      <div className="badge badge-sm badge-neutral h-8 w-8 rounded-full prose prose-emerald">
        <p className="text-base before:content-['+'] font-semibold">
          {users?.length - 3}
        </p>
      </div>
    </div>
  </div>
);

export default AvatarStack;
