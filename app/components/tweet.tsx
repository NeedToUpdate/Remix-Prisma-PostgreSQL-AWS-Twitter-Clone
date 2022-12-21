import type { Tweet as ITweet, User } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { UserCircle } from "~/components/user-circle";

export function Tweet({ user, tweet }: { user: User; tweet: ITweet }) {
  const navigate = useNavigate();
  return (
    <div className={`flex p-4 rounded-xl w-full gap-x-2 relative`}>
      <div>
        <UserCircle onClick={() => navigate(`tweet/${user.id}`)} user={user} className="h-16 w-16" />
      </div>
      <div className="flex flex-col">
        <p className={`font-bold text-lg whitespace-pre-wrap break-all`}>
          {user.firstName} {user.lastName}
        </p>
        <p className={`whitespace-pre-wrap break-all`}>{tweet.content}</p>
      </div>
    </div>
  );
}
