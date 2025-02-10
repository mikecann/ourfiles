import { cronJobs } from "convex/server";
import { internal, api } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { FILE_CLEAR_INTERVAL_MINS } from "./constants";

export const wipeFiles = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const files = await ctx.db.query("files").collect();
    const fileIds = files.map((file: Doc<"files">) => file._id);
    if (fileIds.length > 0)
      await ctx.runMutation(api.files.remove, { ids: fileIds });
    return null;
  },
});

const crons = cronJobs();

// Only register the cron if interval is positive
if (FILE_CLEAR_INTERVAL_MINS > 0)
  crons.interval(
    "wipe-files",
    { minutes: FILE_CLEAR_INTERVAL_MINS },
    internal.crons.wipeFiles,
    {},
  );

export default crons;
