import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import UserSettings from './Pages/UserSettings';

const TheRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/settings" element={<UserSettings />} />
            </Routes>
        </Router>
    )
}

export default TheRoutes