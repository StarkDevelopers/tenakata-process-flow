const axios = require('axios');

const API_ENDPOINT = process.env.API_ENDPOINT;

module.exports = async (path, method, body) => {
  const config = {
    method,
    url: `${API_ENDPOINT}${path}`,
    headers: {
      'x-api-key': 'admin@123'
    },
    data: body
  };

  const response = await axios(config);

  let jsonResponse;
  if (response.data.toString().indexOf('{') > -1) {
    jsonResponse = JSON.parse(JSON.stringify(response.data.substring(response.data.indexOf('{'))));
  } else {
    jsonResponse = JSON.parse(JSON.stringify(response.data));
  }

  return jsonResponse;
}
