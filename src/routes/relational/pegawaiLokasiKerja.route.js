import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createSchema,
  updateSchema,
  readSchema,
  paramsSchema,
} from "../../validations/relational/pegawaiLokasiKerja.validation.js";
import createController from "../../controllers/relational/pegawaiLokasiKerja/create.controller.js";
import readController from "../../controllers/relational/pegawaiLokasiKerja/read.controller.js";
import getByIdController from "../../controllers/relational/pegawaiLokasiKerja/getById.controller.js";
import updateController from "../../controllers/relational/pegawaiLokasiKerja/update.controller.js";
import deleteController from "../../controllers/relational/pegawaiLokasiKerja/delete.controller.js";

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
