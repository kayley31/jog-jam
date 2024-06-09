import React from 'react';
import NewPlaylist from "../Components/NewPlaylist";
import { useNavigate } from 'react-router-dom';
import Featured from "../Components/Featured";

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <h1>Welcome to Jog Jam!</h1>
            <div>
            <p className='homepage'>If you're new here, make sure to visit the <span className="links" onClick={() => navigate('/create')}>Create Playlists page</span> to get started, or explore our <span className="links" onClick={() => navigate('/find')}>ready-made playlists</span>.</p>
            <p className='homepage'> If you're a returning Jog Jammer, please see your saved playlists below.</p>
            </div>
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