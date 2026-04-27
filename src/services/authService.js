import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/userRepository.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function signup({ username, email, password }) {
  if (!username || !email || !password) {
    return { status: 400, data: { error: "Username, email, and password are required" } };
  }

  const existingEmail = await userRepo.findByEmail(email);
  if (existingEmail) {
    return { status: 409, data: { error: "Email already exists" } };
  }

  const existingUsername = await userRepo.findByUsername(username);
  if (existingUsername) {
    return { status: 409, data: { error: "Username already exists" } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepo.createUser({
    username,
    email,
    password: hashedPassword,
  });

  return {
    status: 201,
    data: { id: user.id, username: user.username, email: user.email, role: user.role },
  };
}

export async function login({ email, password }) {
  if (!email || !password) {
    return { status: 400, data: { error: "Email and password are required" } };
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    return { status: 401, data: { error: "Invalid email or password" } };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { status: 401, data: { error: "Invalid email or password" } };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  return { status: 200, data: { token } };
}
