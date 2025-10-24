// src/routes/transaction/logRawAbsensi.route.js
// Rute untuk operasi CRUD log raw absensi pada domain transaction.

import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createSchema,
  updateSchema,
  readSchema,
  paramsSchema,
} from '../../validations/transactional/logRawAbsensi.validation.js';
import createController from '../../controllers/transactional/logRawAbsensi/create.controller.js';
import readController from '../../controllers/transactional/logRawAbsensi/read.controller.js';
import getByIdController from '../../controllers/transactional/logRawAbsensi/getById.controller.js';
import updateController from '../../controllers/transactional/logRawAbsensi/update.controller.js';
import deleteController from '../../controllers/transactional/logRawAbsensi/delete.controller.js';

const router = Router();

// GET /log-raw-absensi
router.get('/', validate(readSchema), readController);

// POST /log-raw-absensi
router.post('/', validate(createSchema), createController);

// GET /log-raw-absensi/:id
router.get('/:id', validate(paramsSchema, 'params'), getByIdController);

// PUT /log-raw-absensi/:id
router.put(
  '/:id',
  validate(paramsSchema, 'params'),
  validate(updateSchema),
  updateController,
);

// DELETE /log-raw-absensi/:id
router.delete('/:id', validate(paramsSchema, 'params'), deleteController);

export default router;