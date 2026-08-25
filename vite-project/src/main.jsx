import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthContextProvider from "./context/AuthContext.jsx";
import CrewContextProvider from "./context/CrewContext.jsx";
import CaptainContextProvider from "./context/CaptainContext.jsx";
import "./styles/variables.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <CaptainContextProvider>
        <CrewContextProvider>
          <App />
        </CrewContextProvider>
      </CaptainContextProvider>
    </AuthContextProvider>
  </BrowserRouter>,
);
