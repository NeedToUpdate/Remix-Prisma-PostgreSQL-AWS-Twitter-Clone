import type { User } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { UserCircle } from "./user-circle";

export function UserPanel({ users }: { users: User[] }) {
  const navigate = useNavigate();
  return (
    <div className=" w-1/6  bg-slate-50 flex flex-col shadow-md">
      <div className="text-center h-16 flex bg-slate-100 pl-2 items-center justify-start">
        <h2 className="text-xl text-blue-600 font-semibold">Users</h2>
      </div>
      <div className="flex-1 overflow-y-scroll py-4 flex flex-wrap gap-1">
        {users.map((user) => {
          return <UserCircle key={user.id} user={user} className="h-10 w-10 mx-auto flex-shrink-0" onClick={() => navigate(`tweet/${user.id}`)} />;
        })}
      </div>
      <div className="text-center p-2 bg-slate-100 ">
        <form action="/logout" method="POST">
          <button type="submit" className="rounded-sm bg-sky-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-sky-400 hover:-translate-y-1">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
