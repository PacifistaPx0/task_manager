import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/auth";

import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function Registration() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await register(fullName, email, password, password2);
    if (error) {
      alert(error);
      setIsLoading(false);
    } else {
      navigate("/"); // Redirect after successful registration
      alert("Registration successful! You are now logged in.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <BaseHeader />

      {/* Registration Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign Up</h1>
          <p className="text-center text-gray-500 mb-4">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-500 hover:underline">
              Login here
            </Link>
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="full_name" className="block text-gray-600 font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="John Doe"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="johndoe@gmail.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="**************"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="password2" className="block text-gray-600 font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="password2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="**************"
                autoComplete="new-password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="mb-4">
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold bg-teal-500 hover:bg-teal-600 transition duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>
                    Signing up{" "}
                    <svg
                      className="animate-spin inline-block w-4 h-4 ml-2"
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
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <BaseFooter />
    </>
  );
}

export default Registration;
