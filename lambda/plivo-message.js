const axios = require('axios');

exports.handler = async function (event, context) {
  try {
    // Parse the incoming Plivo message
    const body = JSON.parse(event.body);
    const { From, To, Text } = body;

    // Make a POST request to your Express.js API endpoint
    const apiResponse = await axios.post(
      'https://https://lucent-cajeta-ce9326.netlify.app/api/messages',
      { phone_number: From, message: Text, author: 'plivo' }
    );

    console.log('API Response:', apiResponse.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Function executed successfully' }),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error: ${error.message}` }),
    };
  }
};

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Function executed successfully' }),
    };
  };
  
