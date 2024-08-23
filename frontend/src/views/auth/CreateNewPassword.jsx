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

    // Password validation
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const otp = searchParams.get("otp"); // Assuming the OTP is passed as a query parameter
      const uuid64 = searchParams.get("uuid64"); // Assuming the uuid64 is passed as well

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

      <section
        className="container d-flex flex-column vh-100"
        style={{ marginTop: "150px" }}
      >
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Set New Password</h1>
                </div>
                {/* Form */}
                <form
                  className="needs-validation"
                  noValidate=""
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="form-control"
                      name="newPassword"
                      placeholder="**************"
                      required=""
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="**************"
                      required=""
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="d-grid">
                    {isLoading ? (
                      <button
                        disabled
                        type="submit"
                        className="btn btn-primary"
                      >
                        Changing Password{" "}
                        <i className="fas fa-spinner fa-spin"></i>
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Change Password
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BaseFooter />
    </>
  );
}

export default NewPassword;