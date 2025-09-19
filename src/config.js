// API Configuration
const config = {
  // Development
  development: {
    API_BASE_URL: 'https://djrbreview.vercel.app/api'
  },
  
  // Production - Replace with your actual server URL
  production: {
    API_BASE_URL: 'https://djrbserver.vercel.app/api'
  },
  
  // Alternative: Use environment variables
  // API_BASE_URL: process.env.REACT_APP_API_URL || 'djrbserver.vercel.app/api'
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export default config[environment];

// Alternative: Export a function to get API URL
export const getApiUrl = () => {
  // Option 1: Use environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }


  const environment = process.env.NODE_ENV || 'development';
  
  if (environment === 'development') {
      return 'https://djrbserver.vercel.app/api'; // ← if you run backend locally during dev, change this to localhost
    }
  
    // Production backend
    return 'https://djrbserver.vercel.app/api';
  };
  // Option 2: Use current hostname
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // If running on same domain, use relative URL
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `${protocol}//${hostname}${port ? ':' + port : ''}/api`;
  }
  
  // Fallback to localhost
  return 'https://djrbserver.vercel.app/api';
};
