import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Feed from './pages/Feed';
// import Profile from './pages/Profile';
// import Local from './pages/Local';
// import EditProfile from './pages/EditProfile';
// import OutroUsuario from './pages/OutroUsuario';
// import Amigos from './pages/Amigos';
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Feed = lazy(() => import('./pages/Feed'));
const Profile = lazy(() => import('./pages/Profile'));
const Local = lazy(() => import('./pages/Local'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const OutroUsuario = lazy(() => import('./pages/OutroUsuario'));
const Amigos = lazy(() => import('./pages/Amigos'));
const Planner = lazy(() => import('./pages/Planner'));

const AppRouter: React.FC = () => {
  return (
    <Router future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
      <Suspense fallback={<main className="indoali"><div className="h-screen flex flex-col items-center justify-center">
            <h1 className="bg-white text-lg font-semibold m-[5px]">Carregando...</h1></div></main>}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/local/:id" element={<Local />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/user/:userName" element={<OutroUsuario />} />
          <Route path="/amigos" element={<Amigos />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;