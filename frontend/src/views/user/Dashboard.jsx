import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      {/* Dashboard Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Manage your tasks and view your profile here.
          </p>

          <div className="flex justify-center space-x-4">
            <Link
              to="/tasks"
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300"
            >
              View Tasks
            </Link>
            <Link
              to="/profile"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              View Profile
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
