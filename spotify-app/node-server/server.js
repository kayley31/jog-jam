import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Missing Spotify client credentials');
  process.exit(1); // Exit if credentials are missing
}

app.use(express.json());
app.use(cors()); // Use CORS middleware

// Get Spotify access token using clientId and clientSecret
const getAccessToken = async () => {
  try {
    const url = 'https://accounts.spotify.com/api/token';
    const authHeader = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: authHeader,
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.access_token;
  } catch (error) {
    console.error('Error fetching access token with primary credentials:', error.message);
    // Fallback to backup credentials
    return getAccessTokenWithBackup();
  }
};

// Fallback method for access token using backup credentials
const getAccessTokenWithBackup = async () => {
  if (!backupClientId || !backupClientSecret) {
    console.error('No backup credentials available');
    throw new Error('No backup credentials available');
  }

  console.log('Using backup credentials');
  const url = 'https://accounts.spotify.com/api/token';
  const authHeader = 'Basic ' + Buffer.from(backupClientId + ':' + backupClientSecret).toString('base64');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.access_token;
};

app.get('/', (req, res) => {
  res.send('Welcome to our Spotify API.');
});

// Get genres endpoint to display on frontend dropdown
app.get('/api/genres', async (req, res) => {
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
});

const recommendationOptions = {
  limit: 15,
  target_danceability: 0.9,
  target_popularity: 60,
};

const tempoCategories = {
  jogging: { min: 120, max: 140 },
  average: { min: 140, max: 180 },
  fast: { min: 180, max: 210 },
};

const getArtistId = async (artistName, accessToken) => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });

  const data = await response.json();
  if (data.artists.items.length > 0) {
    return data.artists.items[0].id;
  } else {
    throw new Error(`Artist ${artistName} not found`);
  }
};

app.get('/api/recommendations', async (req, res) => {
  try {
    const { genre, tempo, artists } = req.query;

    if (!tempo || !tempoCategories[tempo]) {
      return res.status(400).json({ error: 'Invalid tempo category' });
    }

    const accessToken = await getAccessToken();
    const tempoRange = tempoCategories[tempo];

    let seedArtists = [];
    if (artists) {
      const artistNames = artists.split(',').map(name => name.trim());
      seedArtists = await Promise.all(artistNames.map(name => getArtistId(name, accessToken)));
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
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
