import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import MissionContextProvider, { MissionContext } from "./Context/MissionContext";
import CrewContextProvider, { CrewContext } from "./Context/CrewContext";
import CaptainContextProvider, { CaptainContext } from "./Context/CaptainContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <CaptainContextProvider>
        <CrewContextProvider>
          <MissionContextProvider>
      <App />
          </MissionContextProvider>
        </CrewContextProvider>
      </CaptainContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
