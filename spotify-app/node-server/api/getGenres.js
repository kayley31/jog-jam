import { getAccessToken } from '../server'; 

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const accessToken = await getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    const data = await response.json();
    if (data.error) {
      console.error('Error from Spotify API:', data.error);
      return res.status(data.error.status || 500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    res.status(500).json({ error: error.message });
  }
}
