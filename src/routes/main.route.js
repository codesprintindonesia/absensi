// src/routes/main.routes.js  
import { Router } from 'express';
import lokasiKerjaRoutes from './master/lokasiKerja.route.js';
import databasesRoutes from './databases.route.js';
import errorHandler from '../middlewares/error-handler.middleware.js';

const router = Router();

// Mount lokasi kerja routes
router.use("/databases", databasesRoutes);
router.use('/lokasiKerja', lokasiKerjaRoutes); 

// Error handler middleware (harus di akhir)
router.use(errorHandler);

export default router;