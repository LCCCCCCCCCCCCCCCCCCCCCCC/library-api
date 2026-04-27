import prisma from "../prisma.js";

export function findAll() {
  return prisma.book.findMany({ orderBy: { id: "asc" } });
}

export function findById(id) {
  return prisma.book.findUnique({ where: { id } });
}

export function findByIsbn(isbn) {
  return prisma.book.findUnique({ where: { isbn } });
}

export function findByCategoryId(categoryId) {
  return prisma.book.findFirst({ where: { categoryId } });
}

export function create(data) {
  return prisma.book.create({ data });
}

export function update(id, data) {
  return prisma.book.update({ where: { id }, data });
}

export function remove(id) {
  return prisma.book.delete({ where: { id } });
}