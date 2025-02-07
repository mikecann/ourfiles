import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      className="group"
      toastOptions={{
        classNames: {
          toast: "border bg-white text-black border-gray-200",
          success: "bg-green-50 border-green-200 text-green-800",
          loading: "bg-blue-50 border-blue-200 text-blue-800",
          error: "bg-red-50 border-red-200 text-red-800",
        },
      }}
    />
  );
}
