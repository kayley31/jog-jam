import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './NewPlaylist.css';
import Popup from './Popup';

// Array of image paths for playlist covers
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
    
    // Accessing the playlists state from the Redux store
    const playlists = useSelector((state => state.playlists.playlists))
    
    // State to keep track of the currently selected playlist
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    
    // Keeping old code commented out just incase I did something wrong

    // const [playlists, setPlaylists] = useState([]);
    // useEffect(() => {
    //     loadPlaylists();
    // }, []);

    // const loadPlaylists = () => {
    //     const savedPlaylists = JSON.parse(localStorage.getItem('playlists')) || [];
    //     setPlaylists(savedPlaylists);
    // };

    const openPlaylist = (playlist) => {
        setSelectedPlaylist(playlist);
    };

    const closeModal = () => {
        setSelectedPlaylist(null);
    };

    return (
        <div>
            {playlists.length > 0 ? (
                <div className="playlist-container">
                    {playlists.map((playlist, index) => (
                        <div key={index} className="playlist-item" onClick={() => openPlaylist(playlist)}>
                            <div className="playlist-cover">
                                <img src={playlistCovers[index % playlistCovers.length]} alt={playlist.name} />
                                <h2>{playlist.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No playlists found.</p>
            )}
            <Popup show={selectedPlaylist !== null} onClose={closeModal}>
                {selectedPlaylist && (
                    <div className="tracks">
                        {selectedPlaylist.tracks.map(track => (
                            <div key={track.id} className="track-item">
                                <img src={track.album.images[0].url} alt={track.name} />
                                <div className="track-details">
                                    <h3 className='track-name'>{track.name}</h3>
                                    <h6>{track.artists.map(artist => artist.name).join(', ')}</h6>
                                    <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default NewPlaylist;