import React, { useState, useEffect } from "react";
import Select from "react-select";
import useAxios from "../../utils/useAxios";
import defaultUserImage from "../../assets/default-user.jpg";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function UserProfile() {
  const [profile, setProfile] = useState({});
  const [countries, setCountries] = useState([]); // Country options
  const [selectedCountry, setSelectedCountry] = useState(null); // Selected country code
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const axiosInstance = useAxios();
  const navigate = useNavigate(); // Initialize navigate

  // Fetch countries and user profile
  useEffect(() => {
    fetchCountries();
    fetchUserProfile();
  }, []);

  // Fetch countries from the backend
  const fetchCountries = async () => {
    try {
      const response = await axiosInstance.get("/countries/");
      const formattedCountries = response.data.map((country) => ({
        value: country.cca2,         // Use cca2 code as the unique value
        label: country.name.common,  // Use plain text so the user can search by name
        flag: country.flag,          // Keep the flag in a separate property
      }));
      setCountries(formattedCountries);
    } catch (error) {
      console.error("Failed to fetch countries", error);
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profile/");
      const profileData = response.data;
      setProfile(profileData);
      setSelectedCountry(profileData.country || null); // Preselect country if available
      setBio(profileData.bio || "");
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  // Handle country selection change
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption ? selectedOption.value : null);
  };

  // Submit profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("country", selectedCountry); // Send selected country code
    if (image) {
      formData.append("image", image);
    }

    try {
      await axiosInstance.patch("/user/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Profile Picture */}
        <div>
          <label className="block text-lg font-medium">Profile Picture</label>
          <img
            src={profile.image || defaultUserImage}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-2"
          />
        </div>

        {/* Country Selector */}
        <div>
          <label className="block text-lg font-medium">Country</label>
          <Select
            options={countries}
            value={countries.find((option) => option.value === selectedCountry)}
            onChange={handleCountryChange}
            placeholder="Select a country"
            isClearable
            // Custom label rendering for dropdown items (flag + code + name)
            formatOptionLabel={(option) => (
              <div className="flex items-center">
                <span className="mr-2">{option.flag}</span>
                {option.label} ({option.value})
              </div>
            )}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-lg font-medium">Bio</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UserProfile;

