import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Enable CORS for all routes - this is needed to connect front and backend
app.use(cors());

//these are Kayley's credentials, ideally we will change to make it more secure
const clientId = '360036d328e8496f8d1ba897fed658c8';
const clientSecret = 'b020dec81c8c452fb8c73be57dc29302';

//get Spotify access token using above cientID and clientSecet
const getAccessToken = async () => {
  const url = 'https://accounts.spotify.com/api/token';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  return data.access_token;
};

app.get('/', (req, res) => {
  res.send('Welcome to our Spotify API.');
});

//Get genres endpoint to display to user on frontend dropdown
app.get('/api/genres', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    console.log('Using access token:', accessToken);
    const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
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
    console.error('Error fetching genres:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Define additional parameters for recommendations. Add more as needed
const recommendationOptions = {
  limit: 15,
  target_danceability: 0.9,
  target_popularity: 60-100,
};

const tempoCategories = {
  jogging: { min: 120, max: 140 },
  average: { min: 140, max: 180 },
  fast: { min: 180, max: 210},
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
