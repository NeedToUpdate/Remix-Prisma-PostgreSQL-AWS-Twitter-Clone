import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server";
import { prisma } from "./prisma.server";
import { User } from "@prisma/client";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  return { id: newUser.id, email: user.email };
};

export const getOtherUsers = async (userId: number) => {
  return prisma.user.findMany({
    where: {
      id: { not: userId },
    },
    orderBy: {
      firstName: "asc",
    },
  });
};

export const getUserById = async (userId: number) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tweets: true,
    },
  });
};

export const updateUser = async (user: Partial<User>) => {
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
};
