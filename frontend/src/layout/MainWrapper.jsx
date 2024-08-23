import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUser, getRefreshedToken } from '../utils/auth';

function MainWrapper({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const pathname = window.location.pathname;
      const publicRoutes = ['/login/', '/register/'];

      if (!publicRoutes.includes(pathname)) {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          try {
            const refreshedToken = await getRefreshedToken(token);
            setUser(refreshedToken);
          } catch (error) {
            console.error("Token refresh failed:", error);
            // Optionally, you can redirect to login or clear the invalid token here
            navigate('/login');
          }
        }
      }
    };

    initializeUser();
  }, [navigate]);

  return <>{children}</>;
}

export default MainWrapper;