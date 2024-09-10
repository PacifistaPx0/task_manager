import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const otp = searchParams.get("otp");
      const uuid64 = searchParams.get("uuid64");

      const response = await apiInstance.post("/user/password-change/", {
        otp,
        uuid64,
        password: newPassword,
      });

      if (response.status === 201) {
        alert("Password changed successfully!");
        navigate("/login");
      }
    } catch (error) {
      alert("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BaseHeader />

      {/* Set New Password Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Set New Password</h1>

          {/* New Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-600 font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="**************"
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-600 font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="**************"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

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
                    Changing Password{" "}
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
                  "Change Password"
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

export default NewPassword;