import getAccessToken from '../utils/getAccessToken.js';
import authenticatedRequest from './AuthenticatedRequest.js';

const authRequest = {
  async getAccessToken() {
    return await getAccessToken();
  },

  async post(url, body) {
    return await authenticatedRequest(url, 'POST', body);
  },

  async get(url) {
    return await authenticatedRequest(url, 'GET');
  },
};

export default authRequest;
