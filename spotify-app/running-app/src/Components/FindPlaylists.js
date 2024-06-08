import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './FindPlaylists.css';
import Popup from './Popup';
import GenreButtons from './GenreButtons';

const SpotifyCarousel = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [genrePlaylists, setGenrePlaylists] = useState({});
  const [workoutPlaylists, setWorkoutPlaylists] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const genres = ['pop', 'rock', 'hiphop', 'jazz', 'disney', 'workout', 'alternative'];

  //fetch access token on component mount
  useEffect(() => {
    const clientId = '91727066bc3e42939489ab03d5124e47';
    const clientSecret = '87deaae70e0c4ec5a8c223d66b9eea62';

    const getToken = async () => {
      try {
        console.log('Requesting access token...');
        const result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        console.log('Access token:', data.access_token);
        setAccessToken(data.access_token);
      } catch (error) {
        console.error('Failed to get access token:', error);
        setError('Failed to get access token');
        setLoading(false);
      }
    };

    getToken();
  }, []);

  //fetch playlists when access token is available 
  useEffect(() => {
    if (accessToken) {
      const fetchFeaturedPlaylists = async () => {
        try {
          console.log('Fetching featured playlists with token:', accessToken);
          const result = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          });

          const data = await result.json();
          if (data.playlists) {
            setFeaturedPlaylists(data.playlists.items);
          } else {
            console.error('Failed to fetch featured playlists:', data);
            setError('Failed to fetch featured playlists');
          }
        } catch (error) {
          console.error('Failed to fetch featured playlists:', error);
          setError('Failed to fetch featured playlists');
        }
      };

      const fetchWorkoutPlaylists = async () => {
        try {
          console.log('Fetching workout playlists with token:', accessToken);
          const result = await fetch('https://api.spotify.com/v1/browse/categories/workout/playlists', {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          });

          const data = await result.json();
          if (data.playlists) {
            setWorkoutPlaylists(data.playlists.items);
          } else {
            console.error('Failed to fetch workout playlists:', data);
            setError('Failed to fetch workout playlists');
          }
        } catch (error) {
          console.error('Failed to fetch workout playlists:', error);
          setError('Failed to fetch workout playlists');
        }
      };

      //fetch playlists for specific genre
      const fetchPlaylistsByGenre = async (genre) => {
        try {
          console.log(`Fetching playlists for genre: ${genre} with token:`, accessToken);
          const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genre}/playlists`, {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          });

          const data = await result.json();
          if (data.playlists) {
            return data.playlists.items;
          } else {
            console.error(`Failed to fetch playlists for genre ${genre}:`, data);
            return [];
          }
        } catch (error) {
          console.error(`Failed to fetch playlists for genre ${genre}:`, error);
          return [];
        }
      };

      //fetch all genres playlists
      Promise.all(genres.map(fetchPlaylistsByGenre)).then(results => {
        const playlistsByGenre = genres.reduce((acc, genre, index) => {
          acc[genre] = results[index];
          return acc;
        }, {});
        setGenrePlaylists(playlistsByGenre);
        setLoading(false);
      }).catch(error => {
        console.error('Failed to fetch playlists by genre:', error);
        setError('Failed to fetch playlists by genre');
        setLoading(false);
      });

      fetchFeaturedPlaylists();
      fetchWorkoutPlaylists();
    }
  }, [accessToken]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
  };

      //handle playlist click to fetch tracks
  const handlePlaylistClick = async (playlistId) => {
    try {
      const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      
      const data = await result.json();
      if (data.items) {
        setTracks(data.items);
        setSelectedPlaylist(playlistId);
        setIsModalOpen(true);
      } else {
        console.error('Failed to fetch tracks:', data);
        setError('Failed to fetch tracks');
      }
    } catch (error) {
        console.error('Failed to fetch tracks:', error);
        setError('Failed to fetch tracks');
      }
    };

    //close popup modal
    const closeModal = () => {
      setIsModalOpen(false);
    };

  const carouselConfig = {
    dots: true,
    infinite: false,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 3,
    arrows: true,
    className: "carousel__wrapper",
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  //render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  //render error state
  if (error) {
    return <div>{error}</div>;
  }

  //render the main content
  return (
    <div className="carousel-container">
      <GenreButtons genres={genres} onGenreClick={handleGenreClick} />
      {selectedGenre && (
        <>
        <h2>{selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Playlists</h2>
        <Slider {...carouselConfig}>
          {genrePlaylists[selectedGenre].map((playlist) => (
            <div key={playlist.id} className="carousel-slide">
              <div className="carousel-group">
                <div
                 key={playlist.id} 
                 className="playlist-item"
                 onClick={() => handlePlaylistClick(playlist.id)}
              >
                 <img src={playlist.images[0]?.url} alt={playlist.name} />  
               </div> 
             </div>
           </div>
         ))}
        </Slider>
        </> 
      )}

      <h2>Featured Playlists</h2>
      <Slider {...carouselConfig}>
        {featuredPlaylists.map((playlist) => (
          <div key={playlist.id} className="carousel-slide">
            <div className="carousel-group">
              <div 
                key={playlist.id} 
                className="playlist-item"
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <img src={playlist.images[0]?.url} alt={playlist.name} />
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <h2>Workout Playlists</h2>
      <Slider {...carouselConfig}>
        {workoutPlaylists.map((playlist) => (
          <div key={playlist.id} className="carousel-slide">
            <div className="carousel-group">
              <div 
                key={playlist.id} 
                className="playlist-item"
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <img src={playlist.images[0]?.url} alt={playlist.name} />
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {Object.keys(genrePlaylists).map((genre) => (
        <div key={genre}>
          <h2>{genre.charAt(0).toUpperCase() + genre.slice(1)} Playlists</h2>
          <Slider {...carouselConfig}>
            {genrePlaylists[genre].map((playlist) => (
              <div key={playlist.id} className="carousel-slide">
                <div className="carousel-group">
                  <div 
                    key={playlist.id} 
                    className="playlist-item"
                    onClick={() => handlePlaylistClick(playlist.id)}
                  >
                    <img src={playlist.images[0]?.url} alt={playlist.name} />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ))}

      <Popup show={isModalOpen} onClose={closeModal}>
        <div className="tracks">
          <h2>Tracks in Selected Playlist</h2>
          {tracks.map((trackItem, index) => (
            <div key={index} className="track-item">
              <img src={trackItem.track.album.images[0]?.url} alt={trackItem.track.name} />
              <div className="track-details">
                <p className="track-name">{trackItem.track.name}</p>
                <h6>{trackItem.track.artists.map(artist => artist.name).join(', ')}</h6>
              </div>
              <a href={trackItem.track.external_urls.spotify} target="_blank" rel="noopener noreferrer">Listen</a>
            </div>
          ))}
        </div>
      </Popup>
    </div>
  );
};

export default SpotifyCarousel;
