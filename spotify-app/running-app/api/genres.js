import getAccessToken from './getAccessToken';
const fetch = require('node-fetch');

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const accessToken = await getAccessToken();
    console.log('Access token:', accessToken); //

    const response = await fetch(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      let errorMsg = 'Unknown error';
      try {
        const errorResponse = await response.json();
        errorMsg = errorResponse?.error?.message || JSON.stringify(errorResponse);
      } catch (jsonError) {
        console.error('Failed to parse error response as JSON', jsonError);
      }
      return res.status(response.status).json({ error: errorMsg });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching genres:', error); // full error, not just .message
    res.status(500).json({ error: error.message });
  }
}
