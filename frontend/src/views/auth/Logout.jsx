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

      <section
        className="container d-flex flex-column vh-100"
        style={{ marginTop: "150px" }}
      >
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Logout</h1>
                  <span>Are you sure you want to log out?</span>
                </div>
                <div>
                  <div className="d-grid">
                    {isLoading ? (
                      <button
                        disabled
                        type="button"
                        className="btn btn-primary"
                      >
                        Logging out <i className="fas fa-spinner fa-spin"></i>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleLogout}
                      >
                        Logout <i className="fas fa-sign-out-alt"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BaseFooter />
    </>
  );
}

export default Logout;
