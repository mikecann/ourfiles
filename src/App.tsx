import { FileUpload } from "./components/FileUpload";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 left-4 flex items-center gap-1 z-50">
        <img src="/convex.svg" alt="Convex Logo" className="w-7 h-7 mt-1.5" />
        <h1 className="text-4xl font-light tracking-tight">
          NAS<span className="font-medium text-blue-500">vex</span>
        </h1>
      </div>
      <FileUpload />
    </div>
  );
}
