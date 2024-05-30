import './NewPlaylist.css'
import { useNavigate } from 'react-router-dom';

function NewPlaylist(){
    const navigate = useNavigate();
    return(
        <div className='button-container'>
        <button onClick={() => navigate('/create')} className='button1'>Create New Playlist</button>
        </div>
    )
}

export default NewPlaylist;