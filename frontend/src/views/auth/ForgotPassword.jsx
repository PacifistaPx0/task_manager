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

      <section
        className="container d-flex flex-column vh-100"
        style={{ marginTop: "150px" }}
      >
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Password Reset</h1>
                  <p className="text-muted">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                <form
                  className="needs-validation"
                  noValidate=""
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      name="email"
                      placeholder="johndoe@gmail.com"
                      required=""
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {message && (
                    <div className="mb-3">
                      <p className="text-success">{message}</p>
                    </div>
                  )}
                  <div>
                    <div className="d-grid">
                      {isLoading ? (
                        <button
                          disabled
                          type="submit"
                          className="btn btn-primary"
                        >
                          Sending... <i className="fas fa-spinner fa-spin"></i>
                        </button>
                      ) : (
                        <button type="submit" className="btn btn-primary">
                          Send Reset Link <i className="fas fa-envelope"></i>
                        </button>
                      )}
                    </div>
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

export default PasswordReset;