import * as authService from "../services/authService.js";

export async function signup(req, res) {
  try {
    const result = await authService.signup(req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
