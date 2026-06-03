import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors theme="system" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
