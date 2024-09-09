import React from "react";
import { Link } from "react-router-dom";

import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

function Dashboard() {
  return (
    <>
        <section
            className="container d-flex flex-column vh-100"
            style={{ marginTop: "150px" }}
        >
            <div className="container my-5">
                <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <h1 className="fw-bold">Welcome to Your Dashboard</h1>
                    <p className="lead">This is where you can manage your tasks and view your profile.</p>
                    <div className="mt-4">
                    <Link to="/tasks" className="btn btn-primary me-3">
                        View Tasks
                    </Link>
                    <Link to="/profile" className="btn btn-secondary">
                        View Profile
                    </Link>
                    </div>
                </div>
                </div>
            </div>
        </section>
    </>
  );
}

export default Dashboard;