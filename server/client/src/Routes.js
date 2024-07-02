import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import UserSettings from './Pages/UserSettings/UserSettings';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Help from './Pages/Help/Help';

const TheRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/settings" element={<UserSettings />} />
            </Route>
            <Route path='/help' element={<Help />} />
        </Routes>
    )
}

export default TheRoutes;