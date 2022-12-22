import { Prisma } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { createTweet, getFilteredTweets, getPaginatedTweets } from "~/utils/tweet.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  if (!userId) {
    redirect("/login");
  }

  const form = await request.formData();
  const content = form.get("content");
  console.log(content);
  if (typeof content !== "string") {
    return json({ error: "Invalid Form Data" }, { status: 400 });
  }
  if (content === "") {
    return json({ error: "Please Write A Tweet" }, { status: 400 });
  }
  const tweet = createTweet(content, userId);
  return json({ tweet }, { status: 200 });
};

const getPage = (searchParams: URLSearchParams) => Number(searchParams.get("page") || "1");

export const loader: LoaderFunction = async ({ request }) => {
  const page = getPage(new URL(request.url).searchParams);
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

  const tweets = await getFilteredTweets(sortOptions, textFilter, page);
  return tweets;
};
