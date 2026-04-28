import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/auth/Login';
import Signup from './pages/auth/SignUp';
import Landing from './pages/LandingPage';
import RequestHelp from './pages/community/RequestHelp';
import MyRequest from './pages/community/MyRequest';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/request-help" element={<RequestHelp />} />
                <Route path="/my-requests" element={<MyRequest />} />
            </Routes>
        </Router>
    )
}

export default App