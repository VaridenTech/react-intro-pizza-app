import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

// บอก TanStack Router ว่า router ตัวไหนคือตัวของแอปเรา
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("ไม่พบ element ที่มี id=\"root\" ใน index.html");
}
const root = createRoot(container);
root.render(<App />);
