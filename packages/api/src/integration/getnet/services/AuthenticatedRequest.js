import Singleton from '../utils/Singleton.js';
import httpRequest from '../utils/httpRequest.js';
import getAccessToken from '../utils/getAccessToken.js';

const client = new Singleton().getInstance();

const authenticatedRequest = async (url, method, body = null, customHeaders = {}) => {
  const accessToken = await getAccessToken();

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Seller-Id': client.sellerId,
    ...customHeaders,
  };

  return httpRequest(url, method, body, headers);
};

export default authenticatedRequest;
