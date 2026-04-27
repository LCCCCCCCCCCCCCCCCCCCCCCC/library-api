import { Router } from "express";
import * as bookController from "../controllers/bookController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateId } from "../middleware/validation.js";

const router = Router();

router.get("/", authenticate, bookController.getAll);
router.get("/:id", authenticate, validateId, bookController.getById);
router.post("/", authenticate, authorize("ADMIN"), bookController.create);
router.put("/:id", authenticate, authorize("ADMIN"), validateId, bookController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateId, bookController.remove);

export default router;
