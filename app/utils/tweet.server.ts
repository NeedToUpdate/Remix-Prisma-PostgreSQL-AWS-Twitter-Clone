import { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";

export const createTweet = async (content: string, userId: number) => {
  await prisma.tweet.create({
    data: {
      content: content,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const getAllTweets = async () => {
  return prisma.tweet.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });
};

const tweetsPerPage = 5;
export const getPaginatedTweets = async (page: number) => {
  if (page < 1) {
    return null;
  }
  return prisma.tweet.findMany({
    skip: tweetsPerPage * (page - 1),
    take: tweetsPerPage,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });
};

export const getFilteredTweets = async (sortFilter: Prisma.TweetOrderByWithRelationInput, whereFilter: Prisma.TweetWhereInput, page: number) => {
  if (page < 1) {
    return null;
  }
  console.log({ skip: tweetsPerPage * (page - 1), take: tweetsPerPage });
  return await prisma.tweet.findMany({
    skip: tweetsPerPage * (page - 1),
    take: tweetsPerPage,
    select: {
      id: true,
      content: true,
      author: true,
    },
    orderBy: {
      ...sortFilter,
    },
    where: {
      ...whereFilter,
    },
  });
};
