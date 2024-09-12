import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../../utils/useAxios"; // Axios instance to make API calls

function Dashboard() {
  const [profile, setProfile] = useState(null); // State to store user profile data
  const axiosInstance = useAxios();

  // Fetch the user info from localStorage
  const userFromStorage = JSON.parse(localStorage.getItem("allUserData"));

  // Fetch the profile data from the backend if needed
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profile/");
      setProfile(response.data); // Set profile data from API
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
            Welcome to Your Dashboard, {userFromStorage.full_name}
          </h1>

          {/* User Info from LocalStorage */}
          <div className="mb-8 text-gray-700">
            <h2 className="text-xl font-semibold">{userFromStorage.full_name}</h2>
            <p>{userFromStorage.email}</p>
            <p>{userFromStorage.username}</p>
          </div>

          {/* Additional Profile Info from API */}
          {profile ? (
            <div className="mb-8 text-gray-700">
              {profile.image && (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
              )}
              <p>{profile.country || "Country not set"}</p>
              <p>{profile.bio || "No bio available"}</p>
            </div>
          ) : (
            <p>Loading additional profile info...</p>
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
