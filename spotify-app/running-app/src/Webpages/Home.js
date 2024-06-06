import NewPlaylist from "../Components/NewPlaylist";
import { useNavigate } from 'react-router-dom';
import Featured from "../Components/Featured";

function Home(){
    const navigate = useNavigate();
    return(
        <>
        <h1>Welcome to Jog Jam!</h1>
        <br />
        <Featured />
        <button onClick={() => navigate('/find')} className='seeAll'>See All</button>
        <h3>My Playlists</h3>
        <NewPlaylist />
        <button onClick={() => navigate('/my')} className='seeAll'>See All</button>
        <button onClick={() => navigate('/create')} className='createBtn'>Create New Playlist</button>
        </>
    )
}

export default Home