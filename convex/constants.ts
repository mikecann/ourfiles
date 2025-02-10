import { query } from "./_generated/server";

// Helper to safely get environment variables with proper typing
const getEnvVar = <T>({
  name,
  parse,
  defaultValue,
}: {
  name: string;
  parse: (value: string) => T;
  defaultValue: T;
}): T =>
  typeof process === "undefined" || !process.env[name]
    ? defaultValue
    : parse(process.env[name]);

// File size limits
const DEFAULT_MAX_FILE_SIZE = 5000 * 1024 * 1024;

export const MAX_FILE_SIZE = getEnvVar({
  name: "MAX_FILE_SIZE",
  parse: parseInt,
  defaultValue: DEFAULT_MAX_FILE_SIZE,
});

// Timeouts
export const UPLOAD_TIMEOUT_MS = getEnvVar({
  name: "UPLOAD_TIMEOUT_MS",
  parse: parseInt,
  defaultValue: 10000, // 10 seconds
});

// File clearing interval in minutes, -1 to disable
export const FILE_CLEAR_INTERVAL_MINS = getEnvVar({
  name: "FILE_CLEAR_INTERVAL_MINS",
  parse: parseInt,
  defaultValue: -1,
});

export const getConfig = query({
  args: {},
  handler: async () => {
    return {
      maxFileSize: MAX_FILE_SIZE,
      uploadTimeoutMs: UPLOAD_TIMEOUT_MS,
    };
  },
});
