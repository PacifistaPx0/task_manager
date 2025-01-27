import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/auth";
import zxcvbn from "zxcvbn"; // <-- NEW: Import zxcvbn

import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function Registration() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // NEW: Track zxcvbn's score (0-4) and feedback
  const [zxcvbnScore, setZxcvbnScore] = useState(null);
  const [zxcvbnFeedback, setZxcvbnFeedback] = useState("");

  const navigate = useNavigate();

  // NEW: Convert numeric score to a friendly label
  const getScoreLabel = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  // NEW: Handle password input changes & run zxcvbn
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);

    if (pwd) {
      const result = zxcvbn(pwd);
      setZxcvbnScore(result.score);
      // If there's a warning (e.g., "This is a top-10 common password"),
      // display it to the user. If none, just clear it or show "No issues".
      setZxcvbnFeedback(result.feedback.warning || "");
    } else {
      setZxcvbnScore(null);
      setZxcvbnFeedback("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic client-side checks (optional, but recommended)
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== password2) {
      alert("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    //    Only accept "Moderate" (2) or above
    if (zxcvbnScore !== null && zxcvbnScore < 2) {
      alert("Your password is too weak. Please use a stronger password.");
      setIsLoading(false);
      return;
    }

    // Attempt registration
    const { error } = await register(fullName, email, password, password2);
    if (error) {
      // If backend sends "password too common" or any other error,
      // it will show up here
      alert(error);
      setIsLoading(false);
    } else {
      navigate("/dashboard");
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
                onChange={handlePasswordChange} // <-- use zxcvbn handler
              />
              {/* NEW: Show zxcvbn strength & feedback */}
              {zxcvbnScore !== null && (
                <p className="text-sm mt-1">
                  <span
                    className={
                      zxcvbnScore <= 1
                        ? "text-red-500"
                        : zxcvbnScore === 2
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    Password Strength: {getScoreLabel(zxcvbnScore)}
                  </span>
                  {zxcvbnFeedback && (
                    <span className="block text-gray-600 mt-1">
                      Note: {zxcvbnFeedback}
                    </span>
                  )}
                </p>
              )}
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
