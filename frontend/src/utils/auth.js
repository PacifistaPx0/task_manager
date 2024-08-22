import { useAuthStore } from "../store/auth";
import axios from "./axios";
import jwt_decode from "jwt-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

// Login user and set tokens if successful
export const login = async (email, password) => {
  try {
    const { data, status } = await axios.post(`user/token/`, {
      email,
      password,
    });

    if (status === 200) {
      setAuthUser(data.access, data.refresh); // Set tokens and user data
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "Something went wrong",
    };
  }
};

// Register user and log in if successful
export const register = async (full_name, email, password, password2) => {
  try {
    const { data } = await axios.post(`user/register/`, {
      full_name,
      email,
      password,
      password2,
    });

    await login(email, password); // Log in user automatically
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        `${error.response.data.full_name} - ${error.response.data.email}` ||
        "Something went wrong",
    };
  }
};

// Log out user by removing tokens and clearing user data
export const logout = () => {
  Cookie.remove("access_token");
  Cookie.remove("refresh_token");
  useAuthStore.getState().setUser(null);
};

// Set user data if tokens are valid, refresh token if necessary
export const setUser = async () => {
  const access_token = Cookie.get("access_token");
  const refresh_token = Cookie.get("refresh_token");

  if (!access_token || !refresh_token) {
    //if token doesnt exist or expired, return
    return;
  }

  if (isAccessTokenExpired(access_token)) {
    const response = getRefreshedToken(refresh_token); // Refresh token if expired
    setAuthUser(response.access, response.refresh);
  } else {
    setAuthUser(access_token, refresh_token); // Set user data with current tokens
  }
};

// Store tokens in cookies and update user data in store
export const setAuthUser = (access_token, refresh_token) => {
  Cookie.set("access_token", access_token, {
    expires: 1, // 1 day expiry
    secure: true,
  });

  Cookie.set("refresh_token", refresh_token, {
    expires: 7, // 7 days expiry
    secure: true,
  });

  const user = jwt_decode(access_token) ?? null;

  if (user) {
    useAuthStore.getState().setUser(user); // Set user data in store
  }
  useAuthStore.getState().setLoading(false); // Stop loading state
};

// Fetch a new access token using the refresh token
export const getRefreshedToken = async () => {
  const refresh_token = Cookie.get("refresh_token");
  const response = await axios.post(`user/token/refresh/`, {
    refresh: refresh_token,
  });
  return response.data;
};

// Check if the access token has expired
export const isAccessTokenExpired = (access_token) => {
  try {
    const decodedToken = jwt_decode(access_token);
    return decodedToken.exp < Date.now() / 1000; // Compare expiration time with current time
  } catch (error) {
    console.log(error);
    return true; // Consider expired if there's an error
  }
};
    