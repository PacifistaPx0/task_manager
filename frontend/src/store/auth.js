import { create } from 'zustand'; // Import the 'create' function from Zustand to create a new store
import { mountStoreDevtool } from 'simple-zustand-devtools'; // Import the 'mountStoreDevtool' function for debugging the store

// Create a Zustand store to manage authentication state
const useAuthStore = create((set, get) => ({
    // Initial state for storing all user data
    allUserData: null,
    
    // Initial state for loading status
    loading: false,

    // Derived state: Returns a simplified user object with user_id and username
    user: () => ({
        user_id: get().allUserData?.user_id || null, // Retrieve user_id from allUserData, or null if not available
        username: get().allUserData?.username || null, // Retrieve username from allUserData, or null if not available
    }),

    // State mutator: Updates the allUserData state with the provided user object
    setUser: (user) => set({
        allUserData: user,
    }),

    // State mutator: Updates the loading state
    setLoading: (loading) => set({
        loading,
    }),

    // Utility function: Checks if the user is logged in by confirming allUserData is not null
    isLoggedIn: () => get().allUserData !== null,
}));

// Conditionally mount the Zustand store to dev tools if in development mode
if (import.meta.env.DEV) {
    mountStoreDevtool("store", useAuthStore); // Attach the store to development tools
}

// Export the useAuthStore hook for use in React components
export { useAuthStore };