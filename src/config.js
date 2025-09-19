// API Configuration
const config = {
  // Development
  development: {
    API_BASE_URL: 'djrbreview.vercel.app'
  },
  
  // Production - Replace with your actual server URL
  production: {
    API_BASE_URL: 'djrbserver.vercel.app'
  },
  
  // Alternative: Use environment variables
  // API_BASE_URL: process.env.REACT_APP_API_URL || 'djrbserver.vercel.app'
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
  
  // Option 2: Use current hostname
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // If running on same domain, use relative URL
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `${protocol}//${hostname}${port ? ':' + port : ''}/api`;
  }
  
  // Fallback to localhost
  return 'djrbserver.vercel.app';
};
