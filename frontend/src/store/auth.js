import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import Cookie from 'js-cookie';
import axiosInstance from '../utils/axios'; // Import your Axios instance

const useAuthStore = create((set, get) => ({
    allUserData: JSON.parse(localStorage.getItem('allUserData')) || null,
    loading: true, // Start with loading true so we can fetch user data on load

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
        email: get().allUserData?.email || null, // Add email to the user object
    }),

    setUser: (user) => {
        localStorage.setItem('allUserData', JSON.stringify(user));
        console.log("User data saved to localStorage:", user); // Log the user data
        set({ allUserData: user, loading: false }); // Set loading to false once data is saved
    },

    setLoading: (loading) => set({ loading }),

    isLoggedIn: () => get().allUserData !== null,

    logout: () => {
        localStorage.removeItem('allUserData');
        Cookie.remove("access_token");  // Clear tokens from cookies
        Cookie.remove("refresh_token");
        set({ allUserData: null });
    },

    // Load user data from access token or localStorage on app load
    initializeAuth: async () => {
        const access_token = Cookie.get("access_token");

        if (access_token) {
            console.log("Access token found, loading user data from token.");
            await get().fetchUserMetadata(); // Fetch user metadata from API
        } else {
            console.log("No access token found, user not logged in.");
            set({ loading: false }); // If no token, stop loading
        }
    },

    // Fetch user metadata from the API if access token is available
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
                },
                loading: false, // Stop loading after data is fetched
            });
            localStorage.setItem('allUserData', JSON.stringify(userData));
        } catch (error) {
            console.error("Failed to fetch user metadata:", error);
            set({ loading: false }); // Stop loading even if there is an error
        }
    },
}));

if (import.meta.env.DEV) {
    mountStoreDevtool("Store", useAuthStore);
}

export { useAuthStore };
