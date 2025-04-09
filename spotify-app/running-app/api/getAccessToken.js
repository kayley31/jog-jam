// getAccessToken.js
const fetch = require('node-fetch');
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export default async function getAccessToken() {
    try {
      console.log('Requesting Spotify access token...');
  
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
        body: 'grant_type=client_credentials',
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Spotify token response error:', data);
        throw new Error(data.error_description || 'Failed to get token');
      }
  
      console.log('Received access token.');
      return data.access_token;
  
    } catch (error) {
      console.error('Error in getAccessToken:', error.message);
      throw error;
    }
  }
  