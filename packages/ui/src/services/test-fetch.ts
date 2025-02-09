import { request } from './fetch';

async function testRequest() {
  try {
    const response = await request({
      endpoint: '/api/test',
      method: 'GET',
      queryParams: {
        search: 'query',
        page: '1',
        sort: 'asc'
      }
    });
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRequest();
