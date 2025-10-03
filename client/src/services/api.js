import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for analysis
});

export const analyzeRepository = async (owner, repo) => {
  try {
    const response = await api.get(`/analyze/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      const status = error.response.status;
      
      if (status === 403) {
        throw new Error(errorData.message || 'Repository access denied. This repository may be private or your GitHub token lacks permissions.');
      } else if (status === 404) {
        throw new Error(errorData.message || 'Repository not found. Please check the repository URL.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later or add a GitHub token for higher limits.');
      } else {
        throw new Error(errorData.message || errorData.error || 'Analysis failed');
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to analysis service. Please check your internet connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred during analysis.');
    }
  }
};

export const getTrendingRepositories = async () => {
  try {
    const response = await api.get('/trending');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending repositories:', error);
    return [];
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health-check');
    return response.data;
  } catch (error) {
    throw new Error('Service unavailable');
  }
};

export default api;
