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
    files: v.array(
      v.object({
        name: v.string(),
        size: v.number(),
        type: v.string(),
        position: v.object({
          x: v.number(),
          y: v.number(),
        }),
      }),
    ),
  },
  handler: async (ctx, { files }) => {
    const fileIds = [];
    for (const file of files) {
      const id = await ctx.db.insert("files", {
        ...file,
        uploadState: {
          kind: "created",
        },
      });
      fileIds.push(id);
    }
    return fileIds;
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

      // Delete from storage if file is uploading or uploaded
      if (
        file.uploadState.kind === "uploading" ||
        file.uploadState.kind === "uploaded"
      ) {
        const storageId = file.uploadState.storageId;
        await ctx.storage.delete(storageId);
      }

      await ctx.db.delete(id);
    }
  },
});

export const startUpload = mutation({
  args: {
    id: v.id("files"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { id, storageId }) => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");

    return await ctx.db.patch(id, {
      uploadState: {
        kind: "uploading",
        progress: 0,
        storageId,
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
        ...file.uploadState,
        progress,
      },
    });
  },
});

export const completeUpload = mutation({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, { id }) => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");
    if (file.uploadState.kind !== "uploading")
      throw new ConvexError("File is not in uploading state");

    const url = await ctx.storage.getUrl(file.uploadState.storageId);
    if (!url) throw new ConvexError("Failed to get download URL");

    return await ctx.db.patch(id, {
      uploadState: {
        kind: "uploaded",
        storageId: file.uploadState.storageId,
        url,
      },
    });
  },
});

export const getDownloadUrl = query({
  args: { ids: v.array(v.id("files")) },
  handler: async (ctx, { ids }) => {
    const urls = [];
    for (const id of ids) {
      const file = await ctx.db.get(id);
      if (!file) throw new ConvexError("File not found");
      if (file.uploadState.kind !== "uploaded") {
        urls.push(null);
        continue;
      }
      const url = await ctx.storage.getUrl(file.uploadState.storageId);
      urls.push(url);
    }
    return urls;
  },
});

export const updatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("files"),
        position: v.object({
          x: v.number(),
          y: v.number(),
        }),
      }),
    ),
  },
  handler: async (ctx, { updates }) => {
    await Promise.all(
      updates.map(({ id, position }) => ctx.db.patch(id, { position })),
    );
  },
});
