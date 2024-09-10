import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function BaseHeader() {
  const user = useAuthStore((state) => state.user());
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const loading = useAuthStore((state) => state.loading);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <header className="bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
        {/* Branding/Logo */}
        <Link className="text-2xl font-bold tracking-wider hover:text-gray-200" to="/">
          TaskManager
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-6">
          {loading ? (
            <li>
              <span className="text-gray-200">Loading...</span>
            </li>
          ) : isLoggedIn ? (
            <>
              <li>
                <Link
                  className="text-white hover:bg-teal-600 hover:text-white transition-all duration-300 rounded px-4 py-2"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="text-white hover:bg-teal-600 hover:text-white transition-all duration-300 rounded px-4 py-2"
                  to="/tasks"
                >
                  Tasks
                </Link>
              </li>
              <li>
                <button
                  className="text-white hover:bg-red-500 hover:text-white transition-all duration-300 rounded px-4 py-2 focus:outline-none"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className="text-white border border-white hover:bg-teal-600 hover:text-teal-300 transition-all duration-300 rounded px-4 py-2"
                  to="/login"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  className="text-white border border-white hover:bg-teal-600 hover:text-teal-300 transition-all duration-300 rounded px-4 py-2"
                  to="/register"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default BaseHeader;
