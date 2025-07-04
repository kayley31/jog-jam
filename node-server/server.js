import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// enable CORS for all routes - to connect front and backend
app.use(cors());

// get Spotify access token using clientID and clientSecret
const getAccessToken = async () => {
  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Spotify token error:', data);
      throw new Error(data.error_description || 'Failed to retrieve access token');
    }

    return data.access_token;
  } catch (err) {
    console.error('getAccessToken() failed:', err.message);
    return null;
  }
};


app.get('/api/getAccessToken', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Failed to get access token:', error.message);
    res.status(500).json({ error: 'Failed to get access token' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to our Spotify API.');
});

// get genres endpoint to display to user on frontend dropdown
app.get('/api/genres', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return res.status(500).json({ error: 'No access token received' });
    }

    const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
    console.log('Requesting genres from Spotify:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Spotify API returned ${response.status}:`, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Error in /api/genres:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Define additional parameters for recommendations
const recommendationOptions = {
  limit: 15, // no. of songs
  target_danceability: 0.9, // danceability index from 0-1
  target_popularity: 60 - 100, // popularity index from 0-100
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
  if (data.artists && data.artists.items.length > 0) {
    return data.artists.items[0].id;
  } else {
    throw new Error(`Artist ${artistName} not found`);
  }
};

app.get('/api/recommendations', async (req, res) => {
  try {
    const genre = req.query.genre;
    const tempoCategory = req.query.tempo;
    const artists = req.query.artists;

    if (!tempoCategory || !tempoCategories[tempoCategory]) {
      return res.status(400).json({ error: 'Invalid tempo category' });
    }

    const accessToken = await getAccessToken();
    console.log('Using access token:', accessToken);

    const tempoRange = tempoCategories[tempoCategory];

    let seedArtists = [];
    if (artists) {
      // split artists into an array, then iterate over each artist name in the array
      const artistNames = artists.split(',').map(name => name.trim());
      // map each name to its corresponding artist ID
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

    if (genre) {
      queryParams.seed_genres = genre;
    }

    if (seedArtists.length > 0) {
      queryParams.seed_artists = seedArtists.join(',');
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`https://api.spotify.com/v1/recommendations?${queryString}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    const data = await response.json();
    if (data.error) {
      console.error('Error from Spotify API:', data.error);
      res.status(data.error.status || 500).json({ error: data.error.message });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});