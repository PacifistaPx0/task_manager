import React, { useState, useEffect } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import useAxios from "../../utils/useAxios";

function UserProfile() {
    const [profile, setProfile] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const axiosInstance = useAxios();
    const options = countryList().getData(); // Country list options

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = () => {
        axiosInstance
            .get("/user/profile/")
            .then((response) => {
                const profileData = response.data;
                setProfile(profileData);
                setSelectedCountry(profileData.country); // Set the initial country if present
                setBio(profileData.bio || "");
            })
            .catch((error) => {
                console.error("Failed to fetch user profile", error);
            });
    };

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption.value); // Update selected country value
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("bio", bio);
        formData.append("country", selectedCountry);
        if (image) {
            formData.append("image", image); // Add image if selected
        }

        axiosInstance
            .patch("/user/profile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                alert("Profile updated successfully");
            })
            .catch((error) => {
                console.error("Failed to update profile", error);
            });
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div>
                    <label className="block text-lg font-medium">Profile Picture</label>
                    <img
                        src={profile.image || "/default-user.jpg"}
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
                        options={options}
                        value={options.find(option => option.value === selectedCountry)}
                        onChange={handleCountryChange}
                        placeholder="Select a country"
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
