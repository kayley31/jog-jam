import fetch from 'node-fetch';

const getAccessToken = async () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify client credentials');
  }

  try {
    const token = await fetchToken(clientId, clientSecret);
    return token;
  } catch (err) {
    console.warn('Primary credentials failed, trying backup...');
    return fetchToken(process.env.BACKUP_CLIENT_ID, process.env.BACKUP_CLIENT_SECRET);
  }
};

const fetchToken = async (id, secret) => {
  const url = 'https://accounts.spotify.com/api/token';
  const authHeader = 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error(data.error?.message || 'Failed to retrieve access token');
  }

  return data.access_token;
};

// Serverless handler
export default async function handler(req, res) {
  try {
    const token = await getAccessToken();
    res.status(200).json({ accessToken: token });
  } catch (err) {
    console.error('Token fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
