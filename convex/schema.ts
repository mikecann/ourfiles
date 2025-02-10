import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    name: v.string(),
    size: v.number(),
    type: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    uploadState: v.union(
      v.object({
        kind: v.literal("created"),
      }),
      v.object({
        kind: v.literal("uploading"),
        progress: v.number(),
        lastProgressAt: v.number(),
        timeoutJobId: v.id("_scheduled_functions"),
      }),
      v.object({
        kind: v.literal("uploaded"),
        storageId: v.id("_storage"),
        url: v.string(),
      }),
      v.object({
        kind: v.literal("errored"),
        message: v.string(),
      }),
    ),
  }),
});
