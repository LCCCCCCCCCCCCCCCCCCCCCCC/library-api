import * as bookRepo from "../repositories/bookRepository.js";
import * as categoryRepo from "../repositories/categoryRepository.js";
import * as borrowRepo from "../repositories/borrowRepository.js";

export async function getAll() {
  const books = await bookRepo.findAll();
  return { status: 200, data: books };
}

export async function getById(id) {
  const book = await bookRepo.findById(id);
  if (!book) {
    return { status: 404, data: { error: "Book not found" } };
  }
  return { status: 200, data: book };
}

export async function create({ title, author, isbn, categoryId }) {
  if (!title || !author || !isbn || !categoryId) {
    return { status: 400, data: { error: "Title, author, isbn, and categoryId are required" } };
  }

  const category = await categoryRepo.findById(categoryId);
  if (!category) {
    return { status: 404, data: { error: "Category not found" } };
  }

  const existingIsbn = await bookRepo.findByIsbn(isbn);
  if (existingIsbn) {
    return { status: 409, data: { error: "A book with this ISBN already exists" } };
  }

  const book = await bookRepo.create({ title, author, isbn, categoryId });
  return { status: 201, data: book };
}

export async function update(id, { title, author, isbn, categoryId }) {
  const existing = await bookRepo.findById(id);
  if (!existing) {
    return { status: 404, data: { error: "Book not found" } };
  }

  if (!title && !author && !isbn && !categoryId) {
    return { status: 400, data: { error: "At least one field is required" } };
  }

  if (categoryId) {
    const category = await categoryRepo.findById(categoryId);
    if (!category) {
      return { status: 404, data: { error: "Category not found" } };
    }
  }

  if (isbn && isbn !== existing.isbn) {
    const duplicate = await bookRepo.findByIsbn(isbn);
    if (duplicate) {
      return { status: 409, data: { error: "A book with this ISBN already exists" } };
    }
  }

  const updated = await bookRepo.update(id, {
    ...(title && { title }),
    ...(author && { author }),
    ...(isbn && { isbn }),
    ...(categoryId && { categoryId }),
  });
  return { status: 200, data: updated };
}

export async function remove(id) {
  const existing = await bookRepo.findById(id);
  if (!existing) {
    return { status: 404, data: { error: "Book not found" } };
  }

  const hasBorrows = await borrowRepo.findByBookId(id);
  if (hasBorrows) {
    return { status: 409, data: { error: "Cannot delete book with existing borrow records" } };
  }

  const deleted = await bookRepo.remove(id);
  return { status: 200, data: deleted };
}