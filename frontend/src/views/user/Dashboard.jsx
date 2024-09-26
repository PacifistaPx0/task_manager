import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../../utils/useAxios";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [countryFlag, setCountryFlag] = useState(""); // State to store the country flag URL
  const axiosInstance = useAxios();

  // Fetch the user info from localStorage
  const userFromStorage = JSON.parse(localStorage.getItem("allUserData"));

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profile/");
      const profileData = response.data;
      setProfile(profileData);
  
      // If the country code exists, fetch the country flag
      if (profileData.country) {
        fetchCountryFlag(profileData.country); // Using the updated function
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  // Fetch the country flag based on the country name using Rest Countries API
  const fetchCountryFlag = async (countryCode) => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      const data = await response.json();
      setCountryFlag(data[0].flags.png); // Save the flag URL in state
    } catch (error) {
      console.error("Failed to fetch country flag", error);
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Dashboard, {userFromStorage.full_name}
          </h1>

          <div className="mb-8 text-gray-700">
            <h2 className="text-xl font-semibold">{userFromStorage.full_name}</h2>
            <p>{userFromStorage.email}</p>
            <p>{userFromStorage.username}</p>
          </div>

          {profile ? (
            <div className="mb-8 text-gray-700">
              {profile.image && (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
              )}
              <div className="flex items-center justify-center">
                {profile.country ? (
                  <>
                    {countryFlag ? (
                      <img
                        src={countryFlag}
                        alt={profile.country}
                        className="w-8 h-8 mr-2"
                      />
                    ) : (
                      <p>{profile.country}</p> // Display country code if the flag is not available
                    )}
                  </>
                ) : (
                  <p>Country not set</p>
                )}
              </div>
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
