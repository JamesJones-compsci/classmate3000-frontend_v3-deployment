import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/base.css"; // Penny - base.css is used instead of App.css, globals.css is absolete and replaced with base.css as well
import "./styles/auth.css"; // Penny - Separate out auth styling to its own file

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
