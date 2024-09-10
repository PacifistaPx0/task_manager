import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../utils/auth";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function Logout() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    await logout(); // Perform logout
    navigate("/login"); // Redirect to login page after logout
    setIsLoading(false);
    alert("Logout successful!");
  };

  return (
    <>
      <BaseHeader />

      {/* Logout Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Logout</h1>
          <p className="text-gray-600 mb-6">
            Are you sure you want to log out?
          </p>

          {/* Logout Button */}
          <div>
            {isLoading ? (
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-teal-500 opacity-50 cursor-not-allowed"
              >
                Logging out{" "}
                <svg
                  className="animate-spin inline-block w-5 h-5 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-teal-500 hover:bg-teal-600 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </section>

      <BaseFooter />
    </>
  );
}

export default Logout;
