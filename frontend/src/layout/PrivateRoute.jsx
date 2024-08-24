import { Navigate } from 'react-router-dom';
import {useAuthStore} from '../store/auth'; // Adjust the import path 

const PrivateRoute = ({ children }) => {
  const { allUserData } = useAuthStore();

  // If user is not logged in, redirect to the login page
  if (!allUserData) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the children components (like Dashboard)
  return children;
};

export default PrivateRoute;