import axios from 'axios';
import { getRefreshedToken, isAccessTokenExpired, setAuthUser } from './auth';
import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    let accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    console.log('Starting request:', req);
    console.log('Current access token:', accessToken);
    console.log('Current refresh token:', refreshToken);

    // If there are no tokens, skip token handling
    if (!accessToken || !refreshToken) {
      console.log('No access or refresh token found, proceeding without token.');
      return req;
    }

    if (isAccessTokenExpired(accessToken)) {
      console.log('Access token expired, attempting to refresh token...');

      try {
        const response = await getRefreshedToken();
        console.log('Token refresh successful:', response);

        accessToken = response.access; //response.data.access was incorrectly loading access token since we already got it from getrefreshedToken
        setAuthUser(accessToken, response.refresh);
        req.headers.Authorization = `Bearer ${accessToken}`;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        // window.location.href = '/login'; // Redirect to login page
        return Promise.reject(error);
      }
    } else {
      console.log('Access token is still valid.');
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log('Request headers after token handling:', req.headers);
    return req;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized - likely due to token issues:', error.response);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        //window.location.href = '/login'; // Redirect to login page
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;