import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

const UPLOAD_TIMEOUT_MS = 10000;

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

      // Cancel timeout if file is uploading
      if (file.uploadState.kind === "uploading")
        await ctx.scheduler.cancel(file.uploadState.timeoutJobId);

      // Delete from storage if file is uploaded
      if (file.uploadState.kind === "uploaded")
        await ctx.storage.delete(file.uploadState.storageId);

      await ctx.db.delete(id);
    }
  },
});

export const startUpload = mutation({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, { id }): Promise<Doc<"files">> => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");

    // Schedule initial timeout
    const timeoutJobId = await ctx.scheduler.runAfter(
      UPLOAD_TIMEOUT_MS,
      internal.files.handleUploadTimeout,
      {
        fileId: id,
      },
    );

    await ctx.db.patch(id, {
      uploadState: {
        kind: "uploading" as const,
        progress: 0,
        lastProgressAt: Date.now(),
        timeoutJobId,
      },
    });

    const updated = await ctx.db.get(id);
    if (!updated) throw new ConvexError("Failed to update file");
    return updated;
  },
});

export const updateUploadProgress = mutation({
  args: {
    id: v.id("files"),
    progress: v.number(),
  },
  handler: async (ctx, { id, progress }): Promise<Doc<"files">> => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");
    if (file.uploadState.kind !== "uploading")
      throw new ConvexError("File is not in uploading state");

    // Cancel existing timeout
    await ctx.scheduler.cancel(file.uploadState.timeoutJobId);

    // Schedule new timeout
    const timeoutJobId = await ctx.scheduler.runAfter(
      UPLOAD_TIMEOUT_MS,
      internal.files.handleUploadTimeout,
      {
        fileId: id,
      },
    );

    await ctx.db.patch(id, {
      uploadState: {
        kind: "uploading" as const,
        progress,
        lastProgressAt: Date.now(),
        timeoutJobId,
      },
    });

    const updated = await ctx.db.get(id);
    if (!updated) throw new ConvexError("Failed to update file");
    return updated;
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
    if (file.uploadState.kind !== "uploading")
      throw new ConvexError("File is not in uploading state");

    // Cancel timeout since upload is complete
    await ctx.scheduler.cancel(file.uploadState.timeoutJobId);

    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new ConvexError("Failed to get download URL");

    return await ctx.db.patch(id, {
      uploadState: {
        kind: "uploaded",
        storageId,
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

export const setErrorState = mutation({
  args: {
    id: v.id("files"),
    message: v.string(),
  },
  handler: async (ctx, { id, message }) => {
    const file = await ctx.db.get(id);
    if (!file) throw new ConvexError("File not found");

    // Cancel timeout if file was uploading
    if (file.uploadState.kind === "uploading") {
      await ctx.scheduler.cancel(file.uploadState.timeoutJobId);
    }

    return await ctx.db.patch(id, {
      uploadState: {
        kind: "errored",
        message,
      },
    });
  },
});

// Internal mutation to handle upload timeouts
export const handleUploadTimeout = internalMutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, { fileId }) => {
    const file = await ctx.db.get(fileId);
    if (!file) return; // File was deleted
    if (file.uploadState.kind !== "uploading") return; // File is no longer uploading

    // Mark the file as errored
    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "errored",
        message: `Upload timed out - no progress for ${UPLOAD_TIMEOUT_MS / 1000} seconds`,
      },
    });
  },
});
