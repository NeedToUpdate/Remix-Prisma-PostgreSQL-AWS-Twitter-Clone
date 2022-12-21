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

export const getFilteredTweets = async (sortFilter: Prisma.TweetOrderByWithRelationInput, whereFilter: Prisma.TweetWhereInput) => {
  return await prisma.tweet.findMany({
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
