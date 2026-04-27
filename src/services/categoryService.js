import * as categoryRepo from "../repositories/categoryRepository.js";

export async function getAll() {
  const categories = await categoryRepo.findAll();
  return { status: 200, data: categories };
}

export async function getById(id) {
  const category = await categoryRepo.findById(id);
  if (!category) {
    return { status: 404, data: { error: "Category not found" } };
  }
  return { status: 200, data: category };
}

export async function create({ name, description }) {
  if (!name || !description) {
    return { status: 400, data: { error: "Name and description are required" } };
  }

  const existing = await categoryRepo.findByName(name);
  if (existing) {
    return { status: 409, data: { error: "Category name already exists" } };
  }

  const category = await categoryRepo.create({ name, description });
  return { status: 201, data: category };
}

export async function update(id, { name, description }) {
  const existing = await categoryRepo.findById(id);
  if (!existing) {
    return { status: 404, data: { error: "Category not found" } };
  }

  if (!name && !description) {
    return { status: 400, data: { error: "At least one field (name or description) is required" } };
  }

  if (name && name !== existing.name) {
    const duplicate = await categoryRepo.findByName(name);
    if (duplicate) {
      return { status: 409, data: { error: "Category name already exists" } };
    }
  }

  const updated = await categoryRepo.update(id, {
    ...(name && { name }),
    ...(description && { description }),
  });
  return { status: 200, data: updated };
}

export async function remove(id) {
  const existing = await categoryRepo.findById(id);
  if (!existing) {
    return { status: 404, data: { error: "Category not found" } };
  }

  const deleted = await categoryRepo.remove(id);
  return { status: 200, data: deleted };
}
