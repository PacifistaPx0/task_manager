// Import the Axios library for making HTTP requests
import axios from 'axios';
import { API_BASE_URL } from './constants';

// Create a customized Axios instance with predefined configuration
const apiInstance = axios.create({ 
    // Set the base URL for all requests made using this instance
    baseURL: API_BASE_URL,
    
    // Specify the maximum time (in milliseconds) before the request times out
    timeout: 10000, // 10 seconds
    
    // Define default headers for all requests
    headers: {
        "Content-Type": "application/json", // Specify the request content type as JSON
        Accept: "application/json",         // Expect JSON response from the server
    },
});

// Export the configured Axios instance for use in other parts of the application
export default apiInstance;