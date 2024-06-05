import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import actions from reducers
import { addPlaylist } from '../store/actions/playlistActions';
import { genresLoading, genresReceived, genresError } from '../store/actions/genresActions';
import { recommendationsLoading, recommendationsReceived, recommendationsError } from '../store/actions/recommendationsActions';

import './CreatePlaylist.css';

const CreatePlaylist = () => {
  const dispatch = useDispatch();

  // Using useSelector hook to access state from Redux store
  const { genres = [], status: genreStatus, error: genreError } = useSelector((state) => state.genres);
  const { recommendations = [], status: recommendationStatus, error: recommendationError } = useSelector((state) => state.recommendations);

  const [selectedGenre, setSelectedGenre] = useState('');
  const [tempoCategory, setTempoCategory] = useState('');
  const [artistNames, setArtistNames] = useState('');
  const [playlistName, setPlaylistName] = useState('');

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
    // Dispatch the loading action before starting the fetch 
    dispatch(genresLoading());

    fetch('http://localhost:3001/api/genres')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        
        // Filter the received genres on the frontend
        const filteredGenres = data.genres.filter(genre => limitedGenres.includes(genre));
        dispatch(genresReceived(filteredGenres));
      })
      .catch(error => {
        // Dispatch the error action if the request fails
        console.error('Error fetching genres:', error)
        dispatch(genresError(error.toString()))
       });
  };



  const fetchRecommendations = () => {
    if (!tempoCategory) {
      alert('Please select a tempo category');
      return;
    }

    if (!selectedGenre && !artistNames) {
      alert('Please select a genre or enter an artist name.');
      return;
    }

  const params = new URLSearchParams({
    tempo: tempoCategory,
    ...(selectedGenre && { genre: selectedGenre }),
    ...(artistNames && { artists: artistNames })
  });
    // Dispatch the loading action before starting the fetch
    dispatch(recommendationsLoading())

    fetch(`http://localhost:3001/api/recommendations?genre=${selectedGenre}&tempo=${tempoCategory}&artists=${artistNames}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Update the Redux store with the received tracks
        dispatch(recommendationsReceived(data.tracks))
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error)
        // Dispatching error action
        dispatch(recommendationsError(error.toString()))
      });
  };

  // Handlers for genre and tempo selection changes
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleTempoChange = (event) => {
    setTempoCategory(event.target.value);
  };

  const createPlaylist = () => {
    // Validation check for playlist name
    if (!playlistName) {
      alert('Please enter a name for your playlist');
      return;
    }

    const newPlaylist = {
      name: playlistName,
      tracks: recommendations
    };

    // Dispatching action to add playlist to Redux store
    dispatch(addPlaylist(newPlaylist));

    console.log('Playlist created:', newPlaylist);
    alert('Playlist created!');
    setPlaylistName('');
    // Clearing recommendations after playlist creation
    dispatch(recommendationsReceived([]));
  };

  return (
    <div>
      {/* Displaying loading/error/success states for genres */}
      {genreStatus === 'loading' && <p className='loading'>Loading genres...</p>}
      {genreStatus === 'failed' && <p>{genreError}</p>}
      {genreStatus === 'succeeded' && (
        <div className="flex-container">
          <div className="flex-item">
            <h4>Step 1</h4>
            <h1>Tempo</h1>
            <p className="flex-text">Do you want go for a gentle jog, or work on your speed? Set your pace!</p>
            <select id="dropdown" data-testid="tempo-dropdown" value={tempoCategory} onChange={handleTempoChange}>
              <option value="">--Choose Tempo--</option>
              <option value="jogging">Jog</option>
              <option value="average">Run</option>
              <option value="fast">Sprint</option>
            </select>
          </div>
          <p className="arrow">&#8594;</p>
          <div className="flex-item">
            <h4>Step 2 (optional)</h4>
            <h1>Genre</h1>
            <p className="flex-text">Do you have a favourite genre? Choose it here! If not, skip to step 3.</p>
            <select id="dropdown" data-testid="genres-dropdown" value={selectedGenre} onChange={handleGenreChange}>
              <option value="">--Choose Genre--</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <p className="arrow">&#8594;</p>
          <div>
            <h4>Step 3 (optional)</h4>
            <h1>Artists</h1>
            <p className="flex-text">You can add up to 4 of your favourite artists to inspire your song recommendations.</p>
            <input id='artistInput' type="text" placeholder="Enter names separated by commas" value={artistNames} onChange={(e) => setArtistNames(e.target.value)} />
          </div>
        </div>
      )}
      <div>
        <button className='centerBtn' onClick={fetchRecommendations}>Generate Recommendations</button>
        {/* Displaying loading/error states for recommendations */}
        {recommendationStatus === 'loading' && <p className='loading'>Loading recommendations...</p>}
        {recommendationStatus === 'failed' && <p>Error: {recommendationError}</p>}
        <div className="recommendations-container">
          {recommendations.map(track => (
            <div key={track.id} className="recommendation-item">
              <img src={track.album.images[0].url} alt={track.name} />
              <div>
                <h3 className='track-name'>{track.name}</h3>
                <h6 className='track-artist'>{track.artists.map((artist) => artist.name).join(', ')}</h6>
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
              </div>
            </div>
          ))}
        </div>
        {recommendations.length > 0 && (
          <div>
            <input id='playlistName' data-testid="playlist-name-input" type="text" placeholder="Enter playlist name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} />
            <button className='centerBtn' onClick={createPlaylist}>Create Playlist</button>
          </div>
        )}
      </div>
    </div>
  );
};


export default CreatePlaylist;