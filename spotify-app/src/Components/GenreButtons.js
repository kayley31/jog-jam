import './GenreButtons.css'
import PropTypes from 'prop-types';

const GenreButtons = ({ genres, onGenreClick}) => (
    <div className="genre-buttons-container">
        <h1 className="genre-title">Genre</h1>
        <div className="genre-buttons">
            {genres.map((genre) => (
                <button key={genre} onClick={() => onGenreClick(genre)}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </button>
             ))}
         </div>
    </div>  
);

GenreButtons.propTypes = {
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    onGenreClick: PropTypes.func.isRequired,
};

export default GenreButtons
