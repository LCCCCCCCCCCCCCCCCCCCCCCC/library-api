import * as bookService from "../services/bookService.js";

export async function getAll(req, res) {
  try {
    const result = await bookService.getAll();
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get books error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getById(req, res) {
  try {
    const result = await bookService.getById(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get book error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function create(req, res) {
  try {
    const result = await bookService.create(req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Create book error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function update(req, res) {
  try {
    const result = await bookService.update(req.params.id, req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Update book error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function remove(req, res) {
  try {
    const result = await bookService.remove(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Delete book error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
