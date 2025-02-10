// File size limits
const DEFAULT_MAX_FILE_SIZE = 5000 * 1024 * 1024;

export const MAX_FILE_SIZE =
  typeof process !== "undefined" && process.env.MAX_FILE_SIZE
    ? parseInt(process.env.MAX_FILE_SIZE)
    : DEFAULT_MAX_FILE_SIZE;

// Timeouts
export const UPLOAD_TIMEOUT_MS =
  typeof process !== "undefined" && process.env.UPLOAD_TIMEOUT_MS
    ? parseInt(process.env.UPLOAD_TIMEOUT_MS)
    : 10000; // 10 seconds
