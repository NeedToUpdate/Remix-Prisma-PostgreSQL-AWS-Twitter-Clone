import type { Tweet as ITweet } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Modal } from "~/components/modal";
import { Tweet } from "~/components/tweet";
import { UserCircle } from "~/components/user-circle";
import { getUserById } from "~/utils/user.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = params;

  if (!userId) {
    return redirect("/home");
  }

  const tweeter = await getUserById(parseInt(userId));
  return json({ tweeter });
};
export default function TweetModal() {
  const { tweeter } = useLoaderData();
  return (
    <Modal isOpen={true} className="w-2/3 p-10">
      <div className="flex flex-col md:flex-row gap-y-2 md:gap-y-0">
        <div className="text-center flex flex-col items-center gap-y-2 pr-8">
          <UserCircle user={tweeter} className="h-12 w-12" />
          <p className="text-sky-500">
            {tweeter.firstName} {tweeter.lastName}
          </p>
        </div>
        {tweeter.tweets.length > 0 ? (
          <div className="flex-1 flex flex-col gap-y-4">
            {tweeter.tweets.map((tweet: ITweet) => (
              <Tweet key={tweet.id} user={tweeter} tweet={tweet} />
            ))}
          </div>
        ) : (
          <div className="flex w-full justify-center items-center">
            <p className="text-xl text-slate-400 italic">{tweeter.firstName} hasn't tweeted yet</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
