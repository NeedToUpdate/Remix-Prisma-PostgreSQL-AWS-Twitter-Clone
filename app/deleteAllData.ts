/*

!WILL DELETE ALL DATA

used for testing

to run:

npx ts-node ./app/deleteAllData.ts

*/

import type { Tweet, User } from "@prisma/client";
import { prisma } from "./utils/prisma.server";

export const clearData = async () => {
  return;
  //!remove line above to use
  const users = await prisma.user.findMany({});
  const tweets = await prisma.tweet.findMany({});

  const deleteUser = async (user: User) => {
    return await prisma.user.delete({
      where: { id: user.id },
    });
  };
  const deleteTweet = async (tweet: Tweet) => {
    return await prisma.tweet.delete({
      where: { id: tweet.id },
    });
  };

  const deleteTweets = async () => {
    return Promise.all(tweets.map((tweet) => deleteTweet(tweet)));
  };

  const deleteUsers = async () => {
    return Promise.all(users.map((user) => deleteUser(user)));
  };

  await deleteTweets();
  await deleteUsers();
};
clearData();
