// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Supabase session provider */}
    <SessionContextProvider supabaseClient={supabase} initialSession={null}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SessionContextProvider>
  </React.StrictMode>
);
