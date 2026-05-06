import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Navigation from "./navigation/Navigation";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Mission from "./pages/Mission";
import DetailMission from "./pages/DetailMission";
import RocketLaunch from "./pages/RocketLaunch";
import SavedMissions from "./pages/SavedMissions";

import SignIn from "./pages/SignUp";
import SignUp from "./pages/SignUp";

import CaptainDashboard from "./pages/CaptainDashboard";
import CrewDashboard from "./pages/CrewDashboard";

import { AuthContext } from "./context/AuthContext";

/* 🔐 PROTECTED ROUTE */
function ProtectedRoute({ children }) {
    const { isAuth } = useContext(AuthContext);

    if (!isAuth) {
        return <Navigate to="/signin" replace />;
    }

    return children;
}

/* 👨‍✈️ ROLE ROUTE */
function RoleRoute({ children, role }) {
    const { isAuth, user } = useContext(AuthContext);

    if (!isAuth) {
        return <Navigate to="/signin" replace />;
    }

    if (user?.roles !== role && user?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <>
            <Navigation />

            <Routes>

                {/* 🌍 PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />

                {/* 🔐 AUTH ROUTES */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* 🚀 PROTECTED ROUTES */}
                <Route
                    path="/mission"
                    element={
                        <ProtectedRoute>
                            <Mission />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/savedmissions"
                    element={
                        <ProtectedRoute>
                            <SavedMissions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/detailmission/:id"
                    element={
                        <ProtectedRoute>
                            <DetailMission />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/rocketlaunch/:id"
                    element={
                        <ProtectedRoute>
                            <RocketLaunch />
                        </ProtectedRoute>
                    }
                />

                {/* 👨‍✈️ CAPTAIN ONLY */}
                <Route
                    path="/captain"
                    element={
                        <RoleRoute role="captain">
                            <CaptainDashboard />
                        </RoleRoute>
                    }
                />

                {/* 👨‍🚀 CREW ONLY */}
                <Route
                    path="/crew"
                    element={
                        <RoleRoute role="crew">
                            <CrewDashboard />
                        </RoleRoute>
                    }
                />

            </Routes>
        </>
    );
}

export default App;