import './AboutApp.css'
import logowhite from '../images/logowhite.png'
import { Link } from 'react-router-dom';

function AboutApp () {
    return (
        <>
        <img className="logo-white" src={logowhite} alt= "jogjam logo"/>
            <h1 class="headline">Creating the perfect soundtrack for your next run</h1> 
            <p> Whether you want to go on a light jog or work on your pace, <strong>Jog Jam</strong> will create a playlist for you!</p>

        <div>
        <h2 className="headline">How does it work?</h2>
        <p>Our playlists are tailored to coincide with your running speed.</p>
            <ul>
                <li>If you choose to <strong>jog</strong>, your playlist will include songs with <strong>120 - 140 beats per minute</strong></li>
                <li>Choose <strong>run</strong> for songs with a slightly faster speed of <strong>140 - 180 bpm</strong></li>
                <li>If you want to run even quicker, choose <strong>sprint</strong> for songs with <strong>180 - 210 bpm</strong></li>
            </ul>
        <p>To tailor the playlist to your taste, you can choose one <strong>genre</strong> in <strong>Step 2</strong>.
            If you'd like to get more specific, you can include up to 4 of your favourite <strong>artists</strong> in <strong>Step 3</strong>. 
            The artists will inspire your playlist - they may not appear directly in your song list if they don't have any songs that meet our other criteria. 
            You need to choose either genre or an artist in order to generate a playlist, or you can use both features together to mix things up!</p>
        <p>Hopefully you'll recognise the songs in your playlist, as we're using Spotify's popularity feature to choose songs with a <strong>popularity score</strong> of <strong>60-100</strong>.</p>
        <p>Our playlists also use Spotify's <strong>danceability</strong> score. If it's suitable for dancing, we'd like to think it's suitable for your <strong>jog jam</strong> too! 
            Our songs have a target danceability score of <strong>0.9/1</strong>.</p>
        <p>Find the playlists you make on the <Link to="/my" className="links">My Playlists</Link> page.</p>
        <p>Don't feel like making a playlist from scratch? Explore ready-made playlists on the <Link to="/find" className="links">Find Playlists</Link> page.</p>
        </div>
        </>     
    )
}

export default AboutApp
