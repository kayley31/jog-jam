import React, { useEffect, useState } from 'react';
import './NewPlaylist.css';

const playlistCovers = [
    './covers/runner.png',
    './covers/shoe.png',
    './covers/band.png', 
    './covers/conductor.png',
    './covers/drum.png',
    './covers/guitar.png',
    './covers/mic.png',
    './covers/saxophone.png',
    './covers/singing.png',
    './covers/trumpet.png',
    './covers/violin.png'
  ];

const NewPlaylist = () => {
    const [playlists, setPlaylists] = useState([]);
    const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  
    useEffect(() => {
      loadPlaylists();
    }, []);
  
    const loadPlaylists = () => {
      const savedPlaylists = JSON.parse(localStorage.getItem('playlists')) || [];
      setPlaylists(savedPlaylists);
    };
  
    const togglePlaylist = (index) => {
      if (expandedPlaylist === index) {
        setExpandedPlaylist(null);  // Collapse the currently expanded playlist
      } else {
        setExpandedPlaylist(index);  // Expand the selected playlist
      }
    };
  
    return (
      <div>
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <div key={index} className="playlist-item">
              <div onClick={() => togglePlaylist(index)} className="playlist-cover">
                <img src={playlistCovers[index % playlistCovers.length]} alt={playlist.name} />
                <h2>{playlist.name}</h2>
              </div>
              {expandedPlaylist === index && (
                <div className="tracks">
                  {playlist.tracks.map(track => (
                    <div key={track.id} className="track-item">
                      <img src={track.album.images[0].url} alt={track.name} />
                      <div>
                        <h3 className='track-name'>{track.name}</h3>
                        <h6>{track.artists.map(artist => artist.name).join(', ')}</h6>
                        <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No playlists found.</p>
        )}
      </div>
    );
  };

export default NewPlaylist;