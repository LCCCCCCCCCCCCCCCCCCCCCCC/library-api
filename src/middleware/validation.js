export function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID must be a positive integer" });
  }
  req.params.id = id;
  next();
}
