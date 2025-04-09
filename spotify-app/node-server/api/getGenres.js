import fetch from 'node-fetch';

// Helper function to get the Spotify access token
const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Failed to obtain access token');
  }

  return data.access_token;
};

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Fetch access token
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return res.status(500).json({ error: 'Failed to get access token' });
    }

    // Fetch available genres from Spotify API
    const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check for non-200 response status
    if (!response.ok) {
      console.error(`Error: Spotify API returned status ${response.status}`);
      const errorResponse = await response.json();
      return res.status(response.status).json({ error: errorResponse.error.message });
    }

    // Parse and return the data
    const data = await response.json();

    // If Spotify API returns an error
    if (data.error) {
      console.error('Error from Spotify API:', data.error);
      return res.status(data.error.status || 500).json({ error: data.error.message });
    }

    // Return the genres data
    res.json(data);
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    res.status(500).json({ error: error.message });
  }
}
