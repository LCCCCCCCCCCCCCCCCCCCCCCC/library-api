import { Router } from "express";
import * as borrowController from "../controllers/borrowController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateId } from "../middleware/validation.js";

const router = Router();

router.get("/", authenticate, borrowController.getAll);
router.get("/:id", authenticate, validateId, borrowController.getById);
router.post("/", authenticate, borrowController.create);
router.put("/:id", authenticate, validateId, borrowController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateId, borrowController.remove);

export default router;
