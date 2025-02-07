import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

export function useOptimisticCreateFile() {
  return useMutation(api.files.create).withOptimisticUpdate(
    (localStore, args) => {
      const existingFiles = localStore.getQuery(api.files.list, {});
      if (existingFiles === undefined) return;

      const optimisticFile: Doc<"files"> = {
        _id: crypto.randomUUID() as Id<"files">,
        _creationTime: Date.now(),
        uploadState: {
          kind: "created",
        },
        ...args,
      };

      localStore.setQuery(api.files.list, {}, [
        ...existingFiles,
        optimisticFile,
      ]);
    },
  );
}

export function useOptimisticUpdateFilePosition() {
  return useMutation(api.files.updatePosition).withOptimisticUpdate(
    (localStore, args) => {
      const existingFiles = localStore.getQuery(api.files.list, {});
      if (existingFiles === undefined) return;

      const updatedFiles = existingFiles.map((file) =>
        file._id === args.id ? { ...file, position: args.position } : file,
      );
      localStore.setQuery(api.files.list, {}, updatedFiles);
    },
  );
}

export function useOptimisticRemoveFile() {
  return useMutation(api.files.remove).withOptimisticUpdate(
    (localStore, args) => {
      const existingFiles = localStore.getQuery(api.files.list, {});
      if (existingFiles === undefined) return;

      const updatedFiles = existingFiles.filter(
        (file) => !args.ids.includes(file._id),
      );
      localStore.setQuery(api.files.list, {}, updatedFiles);
    },
  );
}

export function useFiles() {
  return useQuery(api.files.list) ?? [];
}
