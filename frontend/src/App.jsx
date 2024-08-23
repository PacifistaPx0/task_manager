import { Route, Routes, BrowserRouter } from "react-router-dom"

import MainWrapper from "./layout/MainWrapper";
import PrivateRoute from "./layout/PrivateRoute";

import Register from "../src/views/auth/Register";
import Login from "../src/views/auth/Login";
import Logout from "./views/auth/Logout";
import PasswordReset from "./views/auth/ForgotPassword";
import CreateNewPassword from "./views/auth/CreateNewPassword";

function App() {
  return (
    <BrowserRouter>
      <MainWrapper>
        <Routes>
          <Route path="/register/" element={<Register />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/logout/" element={<Logout />} />
          <Route path="/forgot-password/" element={<PasswordReset />} />
          <Route path="/create-new-password/" element={<CreateNewPassword />} />
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  )
}

export default App;
