import * as borrowRepo from "../repositories/borrowRepository.js";
import * as bookRepo from "../repositories/bookRepository.js";

export async function getAll(user) {
  let borrows;
  if (user.role === "ADMIN") {
    borrows = await borrowRepo.findAll();
  } else {
    borrows = await borrowRepo.findByUserId(user.id);
  }
  return { status: 200, data: borrows };
}

export async function getById(id, user) {
  const borrow = await borrowRepo.findById(id);
  if (!borrow) {
    return { status: 404, data: { error: "Borrow record not found" } };
  }

  if (user.role !== "ADMIN" && borrow.userId !== user.id) {
    return { status: 403, data: { error: "Access denied" } };
  }

  return { status: 200, data: borrow };
}

export async function create({ bookId, dueDate }, user) {
  if (!bookId || !dueDate) {
    return { status: 400, data: { error: "bookId and dueDate are required" } };
  }

  const book = await bookRepo.findById(bookId);
  if (!book) {
    return { status: 404, data: { error: "Book not found" } };
  }

  const activeBorrow = await borrowRepo.findActiveBorrow(bookId);
  if (activeBorrow) {
    return { status: 409, data: { error: "Book is already borrowed and not returned" } };
  }

  const borrow = await borrowRepo.create({
    userId: user.id,
    bookId,
    borrowDate: new Date(),
    dueDate: new Date(dueDate),
    status: "BORROWED",
  });

  return { status: 201, data: borrow };
}

export async function update(id, { returnDate, status, dueDate }, user) {
  const existing = await borrowRepo.findById(id);
  if (!existing) {
    return { status: 404, data: { error: "Borrow record not found" } };
  }

  if (user.role !== "ADMIN" && existing.userId !== user.id) {
    return { status: 403, data: { error: "Access denied" } };
  }

  if (!returnDate && !status && !dueDate) {
    return { status: 400, data: { error: "At least one field (returnDate, status, dueDate) is required" } };
  }

  const updateData = {};
  if (returnDate) updateData.returnDate = new Date(returnDate);
  if (status) updateData.status = status;
  if (dueDate) updateData.dueDate = new Date(dueDate);

  const updated = await borrowRepo.update(id, updateData);
  return { status: 200, data: updated };
}

export async function remove(id) {
  const existing = await borrowRepo.findById(id);
  if (!existing) {
    return { status: 404, data: { error: "Borrow record not found" } };
  }

  const deleted = await borrowRepo.remove(id);
  return { status: 200, data: deleted };
}
