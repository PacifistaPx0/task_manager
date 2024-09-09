import React from 'react';
import { Link } from 'react-router-dom';
import BaseFooter from '../partials/BaseFooter';

const IndexPage = () => {
    return (
        <>
            <header className="bg-light py-3">
                <nav className="container d-flex justify-content-between align-items-center">
                    <h1 className="logo">TaskManager</h1>
                    <div>
                        <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero-section d-flex flex-column align-items-center justify-content-center text-center vh-100 bg-light">
                <div className="container">
                    <h2 className="display-4 fw-bold">Manage Your Tasks Effectively</h2>
                    <p className="lead text-muted my-4">Stay organized, collaborate with your team, and track tasks effortlessly.</p>
                    <Link to="/signup" className="btn btn-lg btn-primary">Get Started for Free</Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-5">
                <div className="container">
                    <h3 className="text-center mb-5">Why Choose TaskManager?</h3>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <h5>Task Tracking</h5>
                            <p>Organize and prioritize your tasks with ease.</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <h5>Team Collaboration</h5>
                            <p>Assign tasks to team members and work together.</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <h5>Due Dates & Reminders</h5>
                            <p>Stay on top of deadlines with automatic reminders.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <BaseFooter />
        </>
    );
};

export default IndexPage;