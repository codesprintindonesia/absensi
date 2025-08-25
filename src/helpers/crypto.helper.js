import crypto from "crypto";

/**
 * Ambil key enkripsi dari ENV
 * hanya logic, tidak ada konstanta di sini
 */
export function getEncryptionKey() {
  const key = process.env.CONFIG_ENC_KEY || "";
  if (key.length < 32) {
    throw new Error("CONFIG_ENC_KEY minimal 32 karakter untuk AES-256");
  }
  return crypto.createHash("sha256").update(key).digest(); // hasil 32 byte
}
