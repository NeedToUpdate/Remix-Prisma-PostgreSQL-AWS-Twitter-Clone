import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import type { Prisma, Tweet as ITweet, User } from "@prisma/client";
import TweetForm from "~/components/tweet-form";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Tweet } from "~/components/tweet";
import { getFilteredTweets } from "~/utils/tweet.server";
import { SearchBar } from "~/components/search-bar";
import { useEffect, useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
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

  const getPage = (searchParams: URLSearchParams) => Number(searchParams.get("page") || "1");
  const page = getPage(new URL(request.url).searchParams);
  const tweets = await getFilteredTweets(sortOptions, textFilter, page);
  return json({ tweets, user });
};
interface ITweetWithAuthor extends ITweet {
  author: User;
}
export default function Home() {
  const [page, setPage] = useState(2);
  const [moreToLoad, setMoreToLoad] = useState(true);
  const { tweets, user } = useLoaderData();
  const [tweetData, setTweetData] = useState(tweets);
  const fetcher = useFetcher();
  const fetchMoreTweets = () => {
    fetcher.load(`/tweet?page=${page}`);
  };
  useEffect(() => {
    //will run every time fetcher adds data from the button triggering the load()
    if (fetcher.data && fetcher.data.length === 0) {
      setMoreToLoad(false);
      return;
    }
    if (fetcher.data && fetcher.data.length > 0) {
      console.log(tweetData, fetcher.data);
      setTweetData((prevTweets: ITweet[]) => [...prevTweets, ...fetcher.data]);
      setPage((old) => old + 1);
    }
  }, [fetcher.data]);
  return (
    <div className="w-full h-screen flex">
      <Outlet />
      <div className="flex flex-col w-full h-full">
        <TweetForm user={user} />
        <SearchBar />
        <div className="bg-slate-200 flex justify-center h-screen">
          <div className="h-full h-max-screen overflow-y-scroll w-full max-w-[600px] bg-white flex flex-col">
            {tweetData?.map((tweet: ITweetWithAuthor) => (
              <Tweet key={tweet.id} user={tweet.author} tweet={tweet} />
            ))}
            <div className="flex-1 flex-grow"></div>
            {moreToLoad && (
              <button onClick={() => fetchMoreTweets()} className="rounded-sm w-full max-w-[600px] h-fit bg-sky-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-sky-400 hover:-translate-y-1">
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
