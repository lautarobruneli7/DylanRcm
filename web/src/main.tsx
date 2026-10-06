import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { Landing } from "./landing/Landing";

// El panel se carga solo en /admin: los visitantes no descargan ese código.
const AdminApp = lazy(() => import("./admin/AdminApp"));
const isAdmin = window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}><AdminApp /></Suspense>
    ) : (
      <Landing />
    )}
  </StrictMode>,
);
