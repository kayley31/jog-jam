import React, { Component } from "react";
import Slider from "react-slick";
import PropTypes from "prop-types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Popup from './Popup';
import "./FindPlaylists.css";

class SpotifyCarousel extends Component {
  constructor(props) {
    super(props);
    // Initialize state variables
    this.state = {
      featuredPlaylists: [],
      accessToken: '',
      loading: true,
      error: null,
      selectedPlaylist: null,
      tracks: [],
      isModalOpen: false
    };
  }

  // Fetch access token when component mounts
  componentDidMount() {
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
        this.setState({ accessToken: data.access_token }, this.fetchFeaturedPlaylists);
      } catch (error) {
        console.error('Failed to get access token:', error);
        this.setState({ error: 'Failed to get access token', loading: false });
      }
    };

    getToken();
  }

  // Fetch featured playlists using the access token
  fetchFeaturedPlaylists = async () => {
    const { accessToken } = this.state;
    try {
      console.log('Fetching featured playlists with token:', accessToken);
      const result = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });

      const data = await result.json();
      if (data.playlists) {
        this.setState({ featuredPlaylists: data.playlists.items, loading: false });
      } else {
        console.error('Failed to fetch featured playlists:', data);
        this.setState({ error: 'Failed to fetch featured playlists', loading: false });
      }
    } catch (error) {
      console.error('Failed to fetch featured playlists:', error);
      this.setState({ error: 'Failed to fetch featured playlists', loading: false });
    }
  }

  // Handle click on a playlist to fetch its tracks
  handlePlaylistClick = async (playlistId) => {
    const { accessToken } = this.state;
    try {
      const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });

      const data = await result.json();
      if (data.items) {
        this.setState({ tracks: data.items, selectedPlaylist: playlistId, isModalOpen: true });
      } else {
        console.error('Failed to fetch tracks:', data);
        this.setState({ error: 'Failed to fetch tracks' });
      }
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
      this.setState({ error: 'Failed to fetch tracks' });
    }
  }

  // Close the popup modal
  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  // Configuration settings for the carousel
  carouselConfig() {
    return {
      dots: true,
      infinite: false,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 5,
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
  }

  // Render the slider with playlists
  renderSlider() {
    const { featuredPlaylists } = this.state;
    if (!featuredPlaylists.length) {
      return null;
    }
    const sliderItems = featuredPlaylists.map((playlist, index) => (
      <div key={index} className="carousel-slide">
        <div className="carousel-group">
          <div 
            key={playlist.id} 
            className="playlist-item"
            onClick={() => this.handlePlaylistClick(playlist.id)}
          >
            <img src={playlist.images[0]?.url} alt={playlist.name} />
          </div>
        </div>
      </div>
    ));
    return (
      <Slider {...this.carouselConfig()}>
        {sliderItems}
      </Slider>
    );
  }

  render() {
    const { loading, error, isModalOpen, tracks } = this.state;

    // Show loading message
    if (loading) {
      return <div>Loading...</div>;
    }

    // Show error message
    if (error) {
      return <div>{error}</div>;
    }

    return (
      <section>
        {/* Render the carousel */}
        <div className="carousel">
          {this.renderSlider()}
        </div>
        {/* Popup to show tracks in the selected playlist */}
        <Popup show={isModalOpen} onClose={this.closeModal}>
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
      </section>
    );
  }
}

SpotifyCarousel.propTypes = {
  blockHeader: PropTypes.object,
  items: PropTypes.array.isRequired,
  type: PropTypes.string,
  pending: PropTypes.bool.isRequired,
};

export default SpotifyCarousel;
