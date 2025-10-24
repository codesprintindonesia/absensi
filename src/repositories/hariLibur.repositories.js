// repositories/hariLibur.repositories.js
// Repository layer untuk operasi database m_hari_libur

import HariLibur from '../models/hariLibur.models.js';
import { Op } from 'sequelize';

/**
 * Mencari semua hari libur dengan filter dan pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Result dengan rows dan count
 */
export const findAllHariLibur = async (options) => {
  const result = await HariLibur.findAndCountAll(options);
  return result;
};

/**
 * Mencari hari libur berdasarkan tanggal
 * @param {string} tanggal - Tanggal dalam format YYYY-MM-DD
 * @returns {Promise<Object|null>} - Data hari libur atau null
 */
export const findHariLiburByTanggal = async (tanggal) => {
  const result = await HariLibur.findByPk(tanggal);
  return result;
};

/**
 * Membuat data hari libur baru
 * @param {Object} data - Data hari libur
 * @returns {Promise<Object>} - Data hari libur yang dibuat
 */
export const createHariLibur = async (data) => {
  const result = await HariLibur.create(data);
  return result;
};

/**
 * Mengupdate data hari libur
 * @param {string} tanggal - Tanggal hari libur
 * @param {Object} data - Data yang akan diupdate
 * @returns {Promise<Array>} - [jumlah rows yang diupdate]
 */
export const updateHariLibur = async (tanggal, data) => {
  const result = await HariLibur.update(data, {
    where: { tanggal },
  });
  return result;
};

/**
 * Menghapus hari libur berdasarkan tanggal
 * @param {string} tanggal - Tanggal hari libur
 * @returns {Promise<number>} - Jumlah rows yang dihapus
 */
export const deleteHariLibur = async (tanggal) => {
  const result = await HariLibur.destroy({
    where: { tanggal },
  });
  return result;
};

/**
 * Mencari hari libur dalam range tanggal
 * @param {string} startDate - Tanggal mulai
 * @param {string} endDate - Tanggal akhir
 * @returns {Promise<Array>} - Array hari libur
 */
export const findHariLiburByDateRange = async (startDate, endDate) => {
  const result = await HariLibur.findAll({
    where: {
      tanggal: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['tanggal', 'ASC']],
  });
  return result;
};

/**
 * Mencari hari libur berdasarkan jenis
 * @param {string} jenisLibur - Jenis libur
 * @returns {Promise<Array>} - Array hari libur
 */
export const findHariLiburByJenis = async (jenisLibur) => {
  const result = await HariLibur.findAll({
    where: { jenis_libur: jenisLibur },
    order: [['tanggal', 'ASC']],
  });
  return result;
};

/**
 * Bulk create hari libur
 * @param {Array} dataArray - Array data hari libur
 * @returns {Promise<Array>} - Array data yang dibuat
 */
export const bulkCreateHariLibur = async (dataArray) => {
  const result = await HariLibur.bulkCreate(dataArray, {
    updateOnDuplicate: ['nama_libur', 'jenis_libur', 'keterangan', 'updated_at'],
  });
  return result;
};
