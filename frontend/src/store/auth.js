import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useAuthStore = create((set, get) => ({
    allUserData: JSON.parse(localStorage.getItem('allUserData')) || null,
    loading: false,

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
    }),

    setUser: (user) => {
        localStorage.setItem('allUserData', JSON.stringify(user));
        set({ allUserData: user });
    },

    setLoading: (loading) => set({ loading }),

    isLoggedIn: () => get().allUserData !== null,

    logout: () => {
        localStorage.removeItem('allUserData');
        set({ allUserData: null });
    },
}));

if (import.meta.env.DEV) {
    mountStoreDevtool("store", useAuthStore);
}

export { useAuthStore };