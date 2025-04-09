import fetch from 'node-fetch';

const tempoCategories = {
  jogging: { min: 120, max: 140 },
  average: { min: 140, max: 180 },
  fast: { min: 180, max: 210 },
};

const recommendationOptions = {
  limit: 15,
  target_danceability: 0.9,
  target_popularity: 60 - 100,
};

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
    const { genre, tempo, artists } = req.query;

    if (!tempo || !tempoCategories[tempo]) {
      return res.status(400).json({ error: 'Invalid tempo category' });
    }

    const accessToken = await getAccessToken();  // Fetch access token
    const tempoRange = tempoCategories[tempo];

    let seedArtists = [];
    if (artists) {
      const artistNames = artists.split(',').map((name) => name.trim());
      seedArtists = await Promise.all(
        artistNames.map((name) => getArtistId(name, accessToken))
      );
    }

    if (!genre && seedArtists.length === 0) {
      return res.status(400).json({ error: 'At least one genre or artist must be provided' });
    }

    const queryParams = {
      ...recommendationOptions,
      min_tempo: tempoRange.min,
      max_tempo: tempoRange.max,
    };

    if (genre) queryParams.seed_genres = genre;
    if (seedArtists.length > 0) queryParams.seed_artists = seedArtists.join(',');

    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`https://api.spotify.com/v1/recommendations?${queryString}`, {
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
    console.error('Error fetching recommendations:', error.message);
    res.status(500).json({ error: error.message });
  }
}

const getArtistId = async (artistName, accessToken) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`,
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }
  );
  const data = await response.json();
  if (data.artists && data.artists.items.length > 0) {
    return data.artists.items[0].id;
  } else {
    throw new Error(`Artist ${artistName} not found`);
  }
};

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
