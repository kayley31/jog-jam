import React from 'react';
import NewPlaylist from "../Components/NewPlaylist";
import { useNavigate } from 'react-router-dom';

function MyPlaylists(){
    const navigate = useNavigate();
    return(
        <>
        <h1>My Playlists</h1>
        <NewPlaylist />
        <button onClick={() => navigate('/create')} className='createBtn'>Create New Playlist</button>
        </>
    )
}

export default MyPlaylists