import prisma from "../prisma.js";

export function findAll() {
  return prisma.borrow.findMany({ orderBy: { id: "asc" } });
}

export function findByUserId(userId) {
  return prisma.borrow.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  });
}

export function findById(id) {
  return prisma.borrow.findUnique({ where: { id } });
}

export function findActiveBorrow(bookId) {
  return prisma.borrow.findFirst({
    where: { bookId, status: "BORROWED" },
  });
}

export function findByBookId(bookId) {
  return prisma.borrow.findFirst({ where: { bookId } });
}

export function create(data) {
  return prisma.borrow.create({ data });
}

export function update(id, data) {
  return prisma.borrow.update({ where: { id }, data });
}

export function remove(id) {
  return prisma.borrow.delete({ where: { id } });
}