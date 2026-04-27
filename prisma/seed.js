import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.borrow.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      username: "john",
      email: "john@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "jane",
      email: "jane@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  // Create categories
  const fiction = await prisma.category.create({
    data: {
      name: "Fiction",
      description: "Fiction books including novels and short stories",
    },
  });

  const science = await prisma.category.create({
    data: {
      name: "Science",
      description: "Science books covering various scientific disciplines",
    },
  });

  const history = await prisma.category.create({
    data: {
      name: "History",
      description: "History books about world events and civilizations",
    },
  });

  // Create books
  const book1 = await prisma.book.create({
    data: {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      categoryId: science.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      isbn: "9780135957059",
      categoryId: science.id,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      categoryId: fiction.id,
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      isbn: "9780062316097",
      categoryId: history.id,
    },
  });

  // Create borrow records
  await prisma.borrow.create({
    data: {
      userId: user1.id,
      bookId: book1.id,
      borrowDate: new Date("2026-04-01"),
      dueDate: new Date("2026-04-15"),
      returnDate: null,
      status: "BORROWED",
    },
  });

  await prisma.borrow.create({
    data: {
      userId: user2.id,
      bookId: book3.id,
      borrowDate: new Date("2026-03-20"),
      dueDate: new Date("2026-04-03"),
      returnDate: new Date("2026-04-01"),
      status: "RETURNED",
    },
  });

  console.log("Seed data created successfully");
  console.log("Admin login: admin@example.com / Admin123!");
  console.log("User login:  john@example.com / User123!");
  console.log("User login:  jane@example.com / User123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
