import { FileUpload } from "./components/FileUpload";
import { AppTitle } from "./components/AppTitle";

export default function App() {
  return (
    <div className="min-h-screen">
      <AppTitle />
      <FileUpload />
    </div>
  );
}
