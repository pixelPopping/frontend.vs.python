import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthContextProvider, {AuthContext} from "./context/AuthContext";
import MissionContextProvider, { MissionContext } from "./Context/MissionContext";
 

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthContextProvider>
    <MissionContextProvider>
    <App />
    </MissionContextProvider>
  </AuthContextProvider>
  </BrowserRouter>
);
