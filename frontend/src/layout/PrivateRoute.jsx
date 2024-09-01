import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const PrivateRoute = ({ children }) => {
  const { allUserData, setUser } = useAuthStore();
  const refreshToken = allUserData?.refresh;

  const validateToken = async () => {
    if (!refreshToken) return;

    try {
      const response = await axios.post(`${API_BASE_URL}user/token/refresh/`, {
        refresh: refreshToken,
      });
      setUser(response.data);
    } catch (error) {
      console.error('Token validation failed: ', error);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (!allUserData) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

