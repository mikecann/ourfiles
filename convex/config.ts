import { query } from "./_generated/server";
import { MAX_FILE_SIZE, UPLOAD_TIMEOUT_MS } from "./constants";

export const getConfig = query({
  args: {},
  handler: async () => {
    return {
      maxFileSize: MAX_FILE_SIZE,
      uploadTimeoutMs: UPLOAD_TIMEOUT_MS,
    };
  },
});
