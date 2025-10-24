import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createSchema,
  updateSchema,
  readSchema,
  paramsSchema,
} from '../../validations/transaction/shiftPegawai.validation.js';
import createController from '../../controllers/transactional/shiftPegawai/create.controller.js';
import readController from '../../controllers/transactional/shiftPegawai/read.controller.js';
import getByIdController from '../../controllers/transactional/shiftPegawai/getById.controller.js';
import updateController from '../../controllers/transactional/shiftPegawai/update.controller.js';
import deleteController from '../../controllers/transactional/shiftPegawai/delete.controller.js';

const router = Router();

router.get('/', validate(readSchema), readController);
router.post('/', validate(createSchema), createController);
router.get('/:id', validate(paramsSchema, 'params'), getByIdController);
router.put('/:id',
  validate(paramsSchema, 'params'),
  validate(updateSchema),
  updateController
);
router.delete('/:id', validate(paramsSchema, 'params'), deleteController);

export default router;
