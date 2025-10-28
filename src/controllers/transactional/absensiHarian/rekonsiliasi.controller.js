// src/controllers/transactional/absensiHarian/rekonsiliasi.controller.js
import * as rekonService from "../../../services/transactional/absensiHarian/rekonsiliasi.service.js";

/**
 * Trigger proses rekonsiliasi untuk tanggal tertentu
 * POST /api/v1/transactional/absensi-harian/rekonsiliasi/proses
 */
const rekonsiliasi = async (req, res) => {
  try {
    const { tanggal } = req.body;
    
    const result = await rekonService.prosesRekonsiliasi(tanggal);
    
    return res.status(200).json({
      code: 200,
      message: 'Proses rekonsiliasi selesai',
      data: result,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error in prosesRekonsiliasi controller:', error);
    
    return res.status(500).json({
      code: 500,
      message: 'Terjadi kesalahan dalam proses rekonsiliasi',
      data: null,
      metadata: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
};
 
export default rekonsiliasi;