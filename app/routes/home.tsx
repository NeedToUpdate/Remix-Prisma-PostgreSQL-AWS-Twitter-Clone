import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { Prisma, Tweet as ITweet, User } from "@prisma/client";
import TweetForm from "~/components/tweet-form";
import { UserPanel } from "~/components/user-panel";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";
import { Tweet } from "~/components/tweet";
import { getAllTweets, getFilteredTweets } from "~/utils/tweet.server";
import { SearchBar } from "~/components/search-bar";
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  const user = await getUser(request);
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("filter");
  let sortOptions: Prisma.TweetOrderByWithRelationInput = {};

  if (sort) {
    if (sort === "date") {
      sortOptions = { createdAt: "desc" };
    }

    if (sort === "sender") {
      sortOptions = { author: { firstName: "asc" } };
    }
  }
  let textFilter: Prisma.TweetWhereInput = {};

  if (filter) {
    textFilter = {
      OR: [
        { content: { mode: "insensitive", contains: filter } },

        {
          author: {
            OR: [{ firstName: { mode: "insensitive", contains: filter } }, { lastName: { mode: "insensitive", contains: filter } }],
          },
        },
      ],
    };
  }

  const tweets = await getFilteredTweets(sortOptions, textFilter);
  return json({ users, tweets, user });
};
interface ITweetWithAuthor extends ITweet {
  author: User;
}
export default function Home() {
  const { users, tweets, user } = useLoaderData();
  console.log(user.profilePicture);
  return (
    <div className="w-full h-screen flex">
      <Outlet />
      <div className="flex flex-col w-full h-full">
        <TweetForm user={user} />
        <SearchBar />
        <div className="h-full w-full flex">
          {tweets?.map((tweet: ITweetWithAuthor) => (
            <Tweet key={tweet.id} user={tweet.author} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
}
