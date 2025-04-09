import { useEffect, useState } from 'react';

function GenreFetcher() {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Step 1: Get token from your backend
        const tokenRes = await fetch('/api/getAccessToken');
        const tokenData = await tokenRes.json();

        if (!tokenData.accessToken) {
          throw new Error('No access token returned');
        }

        // Step 2: Call Spotify directly from the frontend
        const genreRes = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
          headers: {
            Authorization: `Bearer ${tokenData.accessToken}`,
          },
        });

        const genreData = await genreRes.json();

        if (!genreRes.ok) {
          throw new Error(genreData?.error?.message || 'Failed to fetch genres');
        }

        setGenres(genreData.genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError(err.message);
      }
    };

    fetchGenres();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!genres.length) return <p>Loading genres...</p>;

  return (
    <ul>
      {genres.map((genre) => (
        <li key={genre}>{genre}</li>
      ))}
    </ul>
  );
}

export default GenreFetcher;
