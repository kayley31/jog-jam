import React from 'react';
import NewPlaylist from "../Components/NewPlaylist";
import { useNavigate } from 'react-router-dom';
import Featured from "../Components/Featured";

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <h1>Welcome Back to Jog Jam!</h1>
            <h3>Featured Playlists</h3>
            <Featured />
            <button onClick={() => navigate('/find')} className='seeAll'>See All</button>
            <h3>My Playlists</h3>
            <NewPlaylist limit={3} />
            <button onClick={() => navigate('/my')} className='seeAll'>See All</button>
            <button onClick={() => navigate('/create')} className='createBtn'>Create New Playlist</button>
        </>
    )
}

export default Home;