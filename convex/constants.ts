declare global {
  interface ImportMetaEnv {
    CONVEX_MAX_FILE_SIZE_MB?: string;
  }
}

// File size limits
const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_FILE_SIZE = DEFAULT_MAX_FILE_SIZE;

// Timeouts
export const UPLOAD_TIMEOUT_MS = 10000; // 10 seconds
