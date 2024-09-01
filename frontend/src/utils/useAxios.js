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
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    // If there are no tokens, skip token handling
    if (!accessToken || !refreshToken) {
      return req;
    }

    if (isAccessTokenExpired(accessToken)) {
      const response = await getRefreshedToken(refreshToken);
      setAuthUser(response.data.access, response.data.refresh);
      req.headers.Authorization = `Bearer ${response.data.access}`;
    } else {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;