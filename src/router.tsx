import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Local from './pages/Local';
import EditProfile from './pages/EditProfile';
import OutroUsuario from './pages/OutroUsuario';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/local/:id" element={<Local />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/:userName" element={<OutroUsuario />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;