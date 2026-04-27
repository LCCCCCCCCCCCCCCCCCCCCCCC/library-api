import prisma from "../prisma.js";

export function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function findByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

export function createUser(data) {
  return prisma.user.create({ data });
}
