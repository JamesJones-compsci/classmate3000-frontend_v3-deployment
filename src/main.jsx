import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* Global + App-level styles */
import "./styles/index.css";
import "./styles/App.css";
import "./styles/globals.css"; // Penny - Add import for globals style

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
