import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createSchema,
  updateSchema,
  readSchema,
  paramsSchema,
} from "../../validations/master/shiftGroupDetail.validation.js";
import createController from "../../controllers/master/shiftGroupDetail/create.controller.js";
import readController from "../../controllers/master/shiftGroupDetail/read.controller.js";
import getByIdController from "../../controllers/master/shiftGroupDetail/getById.controller.js";
import updateController from "../../controllers/master/shiftGroupDetail/update.controller.js";
import deleteController from "../../controllers/master/shiftGroupDetail/delete.controller.js";

const router = Router();

router.get("/", validate(readSchema), readController);
router.post("/", validate(createSchema), createController);
router.get("/:id", validate(paramsSchema, "params"), getByIdController);
router.put(
  "/:id",
  validate(paramsSchema, "params"),
  validate(updateSchema),
  updateController
);
router.delete("/:id", validate(paramsSchema, "params"), deleteController);

export default router;
