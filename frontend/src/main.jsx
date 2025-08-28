import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Agora ele carrega o App.jsx
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
