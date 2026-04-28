import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/auth/Login';
import Signup from './pages/auth/SignUp';
import Landing from './pages/LandingPage';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
//community
import RequestHelp from './pages/community/RequestHelp';
import MyRequest from './pages/community/MyRequest';
import CommunityProfile from './pages/community/CommunityProfile';
//ngo
import NGODashboard from './pages/ngo/NgoDashboard';
import NgoProfile from './pages/ngo/NgoProfile';
//volunteer
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes> 
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/request-help" element={ <ProtectedRoute allowedRole="community">
                    <RequestHelp />
                </ProtectedRoute>
                } />
                <Route path="/my-requests" element={<MyRequest />} />
                <Route path="/ngo-dashboard" element={<ProtectedRoute allowedRole="ngo">
                    <NGODashboard />
                </ProtectedRoute>} />
                <Route path="/volunteer-dashboard" element={<ProtectedRoute allowedRole="volunteer">
                    <VolunteerDashboard />
                </ProtectedRoute>} />
                <Route path="/volunteer-profile" element={<VolunteerProfile />} />
                <Route path="/community-profile" element={<CommunityProfile />} />
                <Route path="/ngo-profile" element={<NgoProfile />} />
            </Routes>
        </Router>
    )
}

export default App