import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthContextProvider, {AuthContext} from "./context/AuthContext";
import CrewContextProvider, {CrewContext}  from "./context/CrewContext";
import CaptainContextProvider, {CaptainContext} from "./context/CaptainContext";
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
