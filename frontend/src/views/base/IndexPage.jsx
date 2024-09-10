import React from 'react';
import { Link } from 'react-router-dom';
import BaseFooter from '../partials/BaseFooter';

const IndexPage = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="hero-section bg-gradient-to-r from-teal-500 to-blue-500 text-white min-h-screen flex flex-col items-center justify-center">
                <div className="container text-center">
                    <h1 className="text-5xl font-bold tracking-wide mb-6">Manage Your Tasks Effectively</h1>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">Stay organized, collaborate with your team, and track tasks effortlessly. Get started today and boost your productivity.</p>
                    <Link to="/register" className="bg-white text-teal-500 hover:bg-teal-300 hover:text-white transition-all duration-300 px-6 py-3 rounded-lg text-lg font-medium">Get Started for Free</Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-16 bg-gray-100">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose TaskManager?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h5 className="text-xl font-semibold text-gray-800 mb-4">Task Tracking</h5>
                            <p className="text-gray-600">Organize and prioritize your tasks with ease using our intuitive task management tools.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h5 className="text-xl font-semibold text-gray-800 mb-4">Team Collaboration</h5>
                            <p className="text-gray-600">Assign tasks to team members, communicate effortlessly, and collaborate in real-time.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h5 className="text-xl font-semibold text-gray-800 mb-4">Due Dates & Reminders</h5>
                            <p className="text-gray-600">Stay on top of deadlines with automatic reminders and notifications.</p>
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
