import React, { useState, useEffect } from 'react';
import './CreatePlaylist.css';

const CreatePlaylist = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [tempoCategory, setTempoCategory] = useState('');
  const [tempoRange, setTempoRange] = useState({ min: 0, max: 0 });
  const [recommendations, setRecommendations] = useState([]);

  // Choosing which genres to display as there are too many - can amend as needed from full list on genres endpoint
const limitedGenres = [
  'alternative', 
  'country', 
  'dance', 
  'disney', 
  'electronic', 
  'folk', 
  'hip-hop', 
  'jazz', 
  'metal', 
  'pop', 
  'reggae', 
  'rock', 
  'show-tunes'];

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = () => {
    fetch('http://localhost:3001/api/genres')
      .then(response => response.json())
      .then(data => {
        
        // Filter the received genres on the frontend
        const filteredGenres = data.genres.filter(genre => limitedGenres.includes(genre));
        setGenres(filteredGenres);
      })
      .catch(error => console.error('Error fetching genres:', error));
  };

  const fetchRecommendations = () => {
    if (!selectedGenre || !tempoCategory) {
      console.error('Please select a genre and tempo category');
      return;
    }

    fetch(`http://localhost:3001/api/recommendations?genre=${selectedGenre}&tempo=${tempoCategory}`)
      .then(response => response.json())
      .then(data => setRecommendations(data.tracks))
      .catch(error => console.error('Error fetching recommendations:', error));
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleTempoChange = (event) => {
    setTempoCategory(event.target.value);
  };

  return (
    <div>
      <h1>Spotify Recommendations</h1>
      <div>
        <label>Select Genre:</label>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">--Choose Genre--</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Tempo:</label>
        <select value={tempoCategory} onChange={handleTempoChange}>
          <option value="">--Choose Tempo--</option>
          <option value="jogging">A gentle jog</option>
          <option value="average">Running</option>
          <option value="fast">I want to sprint!</option>
        </select>
      </div>
      <div>
      <button onClick={fetchRecommendations}>Generate Recommendations</button>
      <div className="recommendations-container">
        {recommendations.map(track => (
          <div key={track.id} className="recommendation-item">
            <img src={track.album.images[0].url} alt={track.name} />
            <div className="recommendation-details">
              <h3>{track.name}</h3>
              <h6>{track.artists.map(artist => artist.name).join(', ')}</h6>
              <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default CreatePlaylist;
