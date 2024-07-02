import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import UserSettings from './Pages/UserSettings';

const TheRoutes = () => {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/settings" element={<UserSettings />} />
        </Routes>
    )
}

export default TheRoutes;