import { User } from "@prisma/client";

interface props {
  user: User;
  className?: string;
  onClick?: (...args: any) => any;
}

export function UserCircle({ user, onClick, className }: props) {
  return (
    <div className={`${className} cursor-pointer bg-slate-400 rounded-full flex justify-center items-center`} onClick={onClick}>
      <p>
        {user.firstName?.charAt(0).toUpperCase() || "U"}
        {user.lastName?.charAt(0).toUpperCase() || "U"}
      </p>
    </div>
  );
}
