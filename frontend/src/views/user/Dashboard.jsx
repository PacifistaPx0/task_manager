import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../../utils/useAxios"; // Axios instance to make API calls

function Dashboard() {
  const [profile, setProfile] = useState(null); // State to store user profile data
  const axiosInstance = useAxios();

  // Fetch the profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profile/"); // Assuming this is the endpoint for user profile
      setProfile(response.data); // Set profile data in state
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  return (
    <>
      {/* Dashboard Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Dashboard
          </h1>

          {/* Profile Section */}
          {profile ? (
            <div className="mb-8 text-gray-700">
              <img
                src={profile.image} // User profile image
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold">
                {profile.full_name || "No name available"}
              </h2>
              <p>{profile.email || "No email available"}</p>
              <p>{profile.country || "Country not set"}</p>
              <p>{profile.bio || "No bio available"}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}

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
