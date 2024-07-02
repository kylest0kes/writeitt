import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import UserSettings from './Pages/UserSettings/UserSettings';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

const TheRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/settings" element={<UserSettings />} />
            </Route>
        </Routes>
    )
}

export default TheRoutes;