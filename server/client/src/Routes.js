import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import UserSettings from './Pages/UserSettings/UserSettings';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Help from './Pages/Help/Help';
import StoryDetails from './Components/StoryDetails/StoryDetails';
import AllStories from './Pages/AllStories/AllStories';
import PostDetails from './Components/PostDetails/PostDetails';

const TheRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/settings" element={<UserSettings />} />
            </Route>
            <Route path='/help' element={<Help />} />
            <Route path='/stories/story/:slug' element={<StoryDetails />} />
            <Route path='/allstories' element={<AllStories />} />
            <Route path='/posts/post/:slug' element={<PostDetails />} />
        </Routes>
    )
}

export default TheRoutes;
