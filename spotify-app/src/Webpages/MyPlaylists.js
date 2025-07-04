import React from 'react';
import NewPlaylist from "../Components/NewPlaylist";
import { useNavigate } from 'react-router-dom';

function MyPlaylists(){
    const navigate = useNavigate();
    return(
        <>
        <h2>My Playlists</h2>
        <NewPlaylist />
        <button onClick={() => navigate('/create')} className='createBtn'>Create New Playlist</button>
        </>
    )
}

export default MyPlaylists