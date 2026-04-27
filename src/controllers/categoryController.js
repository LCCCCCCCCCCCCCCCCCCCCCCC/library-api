import * as categoryService from "../services/categoryService.js";

export async function getAll(req, res) {
  try {
    const result = await categoryService.getAll();
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getById(req, res) {
  try {
    const result = await categoryService.getById(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get category error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function create(req, res) {
  try {
    const result = await categoryService.create(req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Create category error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function update(req, res) {
  try {
    const result = await categoryService.update(req.params.id, req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Update category error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function remove(req, res) {
  try {
    const result = await categoryService.remove(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
