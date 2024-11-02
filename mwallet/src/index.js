import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "./assets/css/dashlite.css";
import "./assets/css/theme.css";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </React.StrictMode>
);
