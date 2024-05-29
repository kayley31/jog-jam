import React, { useState, useEffect } from 'react';
import './CreatePlaylist.css';

const CreatePlaylist = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [tempoCategory, setTempoCategory] = useState('');
  const [artistNames, setArtistNames] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  // Choosing which genres to display - can amend as needed from full list on genres endpoint
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
    if (!tempoCategory) {
      console.error('Please select a tempo category');
      return;
    }

  const params = new URLSearchParams({
    tempo: tempoCategory,
    ...(selectedGenre && { genre: selectedGenre }),
    ...(artistNames && { artists: artistNames })
  });

    fetch(`http://localhost:3001/api/recommendations?genre=${selectedGenre}&tempo=${tempoCategory}&artists=${artistNames}`)
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
        <div class="flex-container">  
          <div class="flex-item">       
          <h4>Step 1</h4>
            <h1>Tempo</h1>
            <p class="flex-text">Do you want go for a gentle jog, or work on your speed? Set your pace!</p>
            <select id="dropdown" value={tempoCategory} onChange={handleTempoChange}>
              <option value="">--Choose Tempo--</option>
              <option value="jogging">Jog</option>
              <option value="average">Run</option>
              <option value="fast">Sprint</option>
            </select>
          </div>   
          <p class="arrow">&#8594;</p>
        <div class="flex-item">       
          <h4>Step 2 (optional)</h4>
            <h1>Genre</h1> 
            <p class="flex-text">Do you have a favourite genre? Choose it here! If not, skip to step 3.</p>           
            <select id="dropdown" value={selectedGenre} onChange={handleGenreChange}>
              <option value="">--Choose Genre--</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <p class="arrow">&#8594;</p>
        <div>       
          <h4>Step 3 (optional)</h4>
          <h1>Artists</h1>
          <p class="flex-text">You can add up to 4 of your favourite artists to inspire your song recommendations.</p>
        <input
          type="text"
          placeholder="Enter names separated by commas"
          value={artistNames}
          onChange={(e) => setArtistNames(e.target.value)}
        />
        </div>
      </div>
      <div>
      <button onClick={fetchRecommendations}>Generate Recommendations</button>
      <div className="recommendations-container">
        {recommendations.map(track => (
          <div key={track.id} className="recommendation-item">
            <img src={track.album.images[0].url} alt={track.name} />
            <div>
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
