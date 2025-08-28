// src/routes/main.routes.js  
import { Router } from 'express';
import lokasiKerjaRoutes from './master/lokasiKerja.route.js';
import kebijakanAbsensiRoutes from './master/kebijakanAbsensi.route.js';
import shiftGroupRoutes from './master/shiftGroup.route.js';
import shiftKerjaRoutes from './master/shiftKerja.route.js'; 
import shiftGroupDetailRoutes from './master/shiftGroupDetail.route.js';
import databasesRoutes from './databases.route.js';
const router = Router();

// Mount lokasi kerja routes
router.use("/databases", databasesRoutes);
router.use('/lokasi-kerja', lokasiKerjaRoutes); 
router.use('/kebijakan-absensi', kebijakanAbsensiRoutes);
router.use('/shift-group', shiftGroupRoutes);
router.use('/shift-kerja', shiftKerjaRoutes); 
router.use('/shift-group-detail', shiftGroupDetailRoutes);

// Error handler middleware (harus di akhir) 

export default router;