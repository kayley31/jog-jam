import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const backupClientId = process.env.BACKUP_CLIENT_ID;
const backupClientSecret = process.env.BACKUP_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Missing Spotify client credentials');
  process.exit(1);
}

// Get Spotify access token using clientId and clientSecret
export const getAccessToken = async () => {
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
    return getAccessTokenWithBackup();
  }
};

