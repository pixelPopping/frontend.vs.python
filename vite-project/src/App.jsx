import { Routes, Route } from 'react-router-dom';

import Navigation from './navigation/Navigation';

import Home from './pages/Home';
import Contact from './pages/Contact';
import Mission from './pages/Mission';
import SavedMissions from './pages/SavedMissions';
import RocketLaunch from './pages/RocketLaunch';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import ProfilePage from './pages/ProfilePage';

import CaptainDashboard from './pages/CaptainDashboard';
import CrewDashboard from './pages/CrewDashboard';

import ProtectedRoute from './components/ProtectedRoute';

function App() {

    return (
        <>

            <Navigation />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/contact" element={<Contact />} />

                <Route path="/signin" element={<SignIn />} />

                <Route path="/signup" element={<SignUp />} />

                <Route
                    path="/profilepage"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mission"
                    element={
                        <ProtectedRoute role="captain">
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
                    path="/captain-dashboard"
                    element={
                        <ProtectedRoute role="captain">
                            <CaptainDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/crew-dashboard"
                    element={
                        <ProtectedRoute role="crew">
                            <CrewDashboard />
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

            </Routes>

        </>
    );
}

export default App;