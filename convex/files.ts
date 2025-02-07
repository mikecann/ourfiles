import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("files").collect();
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    size: v.number(),
    type: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("files", {
      ...args,
      uploadState: {
        kind: "created",
      },
    });
  },
});

export const updatePosition = mutation({
  args: {
    id: v.id("files"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  handler: async (ctx, { id, position }) => {
    return await ctx.db.patch(id, { position });
  },
});

export const remove = mutation({
  args: { ids: v.array(v.id("files")) },
  handler: async (ctx, { ids }) => {
    for (const id of ids) {
      const file = await ctx.db.get(id);
      if (!file) throw new ConvexError(`File ${id} not found`);
      await ctx.db.delete(id);
    }
  },
});

export const startUpload = mutation({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, { id }) => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");

    return await ctx.db.patch(id, {
      uploadState: {
        kind: "uploading",
        progress: 0,
      },
    });
  },
});

export const updateUploadProgress = mutation({
  args: {
    id: v.id("files"),
    progress: v.number(),
  },
  handler: async (ctx, { id, progress }) => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");
    if (file.uploadState.kind !== "uploading")
      throw new ConvexError("File is not in uploading state");

    return await ctx.db.patch(id, {
      uploadState: {
        kind: "uploading",
        progress,
      },
    });
  },
});

export const completeUpload = mutation({
  args: {
    id: v.id("files"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { id, storageId }) => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");

    return await ctx.db.patch(id, {
      uploadState: {
        kind: "uploaded",
        storageId,
      },
    });
  },
});

export const getDownloadUrl = query({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");
    if (file.uploadState.kind !== "uploaded") return null;

    return await ctx.storage.getUrl(file.uploadState.storageId);
  },
});
