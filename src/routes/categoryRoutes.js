import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateId } from "../middleware/validation.js";

const router = Router();

router.get("/", authenticate, categoryController.getAll);
router.get("/:id", authenticate, validateId, categoryController.getById);
router.post("/", authenticate, authorize("ADMIN"), categoryController.create);
router.put("/:id", authenticate, authorize("ADMIN"), validateId, categoryController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateId, categoryController.remove);

export default router;
