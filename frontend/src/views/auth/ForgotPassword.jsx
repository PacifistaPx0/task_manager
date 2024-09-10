import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiInstance.get(`/user/password-reset/${email}/`);
      setMessage(response.data.message || "Check your email for reset instructions.");
      setIsLoading(false);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <BaseHeader />

      {/* Forgot Password Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Password Reset</h1>
          <p className="text-center text-gray-500 mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Password Reset Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="johndoe@gmail.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && (
              <div className="mb-4">
                <p className="text-green-500">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold bg-teal-500 hover:bg-teal-600 transition duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>
                    Sending...{" "}
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
                  </span>
                ) : (
                  "Send Reset Link"
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

export default PasswordReset;
