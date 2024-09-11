import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom"
import { useAuthStore } from "./store/auth";

import MainWrapper from "./layout/MainWrapper";
import PrivateRoute from "./layout/PrivateRoute";
import Layout from './views/partials/Layout';

import IndexPage from "./views/base/IndexPage";
import Register from "../src/views/auth/Register";
import Login from "../src/views/auth/Login";
import Logout from "./views/auth/Logout";
import PasswordReset from "./views/auth/ForgotPassword";
import CreateNewPassword from "./views/auth/CreateNewPassword";
import Dashboard from "./views/user/Dashboard";
import TaskList from "./views/user/TaskList";
import TaskDetail from "./views/user/TaskDetail";
import CreateTask from "./views/user/CreateTask";
import UserProfile from "./views/user/UserProfile";


function App() {

  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // Load user from token on app load
  }, [initializeAuth]);


  return (
    <BrowserRouter>
      <MainWrapper>
        <Routes>
          {/* Index Route*/}
          <Route path="/" element={<IndexPage />} />

          {/* Auth Routes */}
          <Route path="/register/" element={<Register />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/logout/" element={<Logout />} />
          <Route path="/forgot-password/" element={<PasswordReset />} />
          <Route path="/create-new-password/" element={<CreateNewPassword />} />

          {/* Dashboard and Task Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/tasks/" element={<PrivateRoute><Layout><TaskList /></Layout></PrivateRoute>} />
          <Route path="/tasks/:taskId/" element={<PrivateRoute><Layout><TaskDetail /></Layout></PrivateRoute>} />
          <Route path="/create-task/" element={<PrivateRoute><Layout><CreateTask /></Layout></PrivateRoute>} />
          <Route path="/profile/" element={<PrivateRoute><Layout><UserProfile /></Layout></PrivateRoute>} />
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  )
}

export default App;
