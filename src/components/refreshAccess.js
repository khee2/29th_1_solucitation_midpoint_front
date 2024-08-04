import axios from 'axios';

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error.response?.data?.message || error.message);
    if (
      error.response?.data?.error === 'refresh_token_expired' ||
      error.response?.data?.error === 'invalid_token'
    ) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Refresh token has expired or is invalid. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'An unknown error occurred while refreshing the token.');
  }
};