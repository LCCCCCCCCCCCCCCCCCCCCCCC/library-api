import * as borrowService from "../services/borrowService.js";

export async function getAll(req, res) {
  try {
    const result = await borrowService.getAll(req.user);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get borrows error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getById(req, res) {
  try {
    const result = await borrowService.getById(req.params.id, req.user);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get borrow error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function create(req, res) {
  try {
    const result = await borrowService.create(req.body, req.user);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Create borrow error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function update(req, res) {
  try {
    const result = await borrowService.update(req.params.id, req.body, req.user);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Update borrow error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function remove(req, res) {
  try {
    const result = await borrowService.remove(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Delete borrow error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
