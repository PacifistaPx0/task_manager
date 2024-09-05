
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import Cookie from 'js-cookie';
import axiosInstance from '../utils/axios'; // Import your Axios instance

const useAuthStore = create((set, get) => ({
    allUserData: JSON.parse(localStorage.getItem('allUserData')) || null,
    loading: false,

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
        email: get().allUserData?.email || null, // Add email to the user object
    }),

    setUser: (user) => {
        localStorage.setItem('allUserData', JSON.stringify(user));
        console.log("User data saved to localStorage:", user); // Log the user data
        set({ allUserData: user });
    },

    setLoading: (loading) => set({ loading }),

    isLoggedIn: () => get().allUserData !== null,

    logout: () => {
        localStorage.removeItem('allUserData');
        set({ allUserData: null });
    },

    // Add fetchUserMetadata to retrieve the full user details
    fetchUserMetadata: async () => {
        try {
            const access_token = Cookie.get("access_token"); // Get access token from cookies
            if (!access_token) {
            throw new Error("No access token available");
            }

            const response = await axiosInstance.get('/user/detail/', {
                headers: {
                Authorization: `Bearer ${access_token}`, // Include the Bearer token
                },
            });

            const userData = response.data;

            console.log("Fetched user metadata:", userData); // Log the full user data
            set({
                allUserData: {
                    user_id: userData.id,
                    username: userData.username,
                    email: userData.email, // Store email in local state
                }
            });
            localStorage.setItem('allUserData', JSON.stringify(userData));
        } catch (error) {
            console.error("Failed to fetch user metadata:", error);
        }
    },
}));

if (import.meta.env.DEV) {
    mountStoreDevtool("Store", useAuthStore);
}

export { useAuthStore };