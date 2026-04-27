import prisma from "../prisma.js";

export function findAll() {
  return prisma.category.findMany({ orderBy: { id: "asc" } });
}

export function findById(id) {
  return prisma.category.findUnique({ where: { id } });
}

export function findByName(name) {
  return prisma.category.findUnique({ where: { name } });
}

export function create(data) {
  return prisma.category.create({ data });
}

export function update(id, data) {
  return prisma.category.update({ where: { id }, data });
}

export function remove(id) {
  return prisma.category.delete({ where: { id } });
}
