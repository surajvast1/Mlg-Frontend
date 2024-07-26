import React, { useState } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';
import { pieArcLabelClasses } from '@mui/x-charts';
import Loader from './Loader'; // Ensure this component exists

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [pos, setPos] = useState(0);
  const [neg, setNeg] = useState(0);
  const [loading, setLoading] = useState(false); // State to manage loading

  const data = [
    { value: pos, label: 'Positive', color: '#40A578' },
    { value: neg, label: 'Negative', color: '#FFAF61' },
  ];

  const size = {
    width: 400,
    height: 400,
  };
  const loadMovies = async (searchTerm) => {
    if (!searchTerm) {
      setMovies([]);
      return;
    }
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`; // Updated to HTTPS
    try {
      const response = await axios.get(URL);
      if (response.data.Response === "True") {
        setMovies(response.data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadMovieDetails = async (movieId) => {
    const URL = `https://www.omdbapi.com/?i=${movieId}&apikey=fc1fef96`; // Updated to HTTPS
    try {
      const response = await axios.get(URL);
      setSelectedMovieDetails(response.data);
      sendImdbIdToBackend(movieId, response.data.Title);
    } catch (error) {
      console.error("Error fetching data:", error); 
    }
  };

   
  const sendImdbIdToBackend = async (imdbId, imdbName) => {
    // const URL = 'http://backend:8002/scrape_reviews';  // Adjusted to internal Docker service name and port
    const URL = 'https://sentimental-analyser-backend.shubhamshrivastava.co.in/scrape_reviews';
    try {
        setLoading(true); // Set loading to true before the request
        const response = await axios.post(URL, { imdb_id: imdbId, imdb_name: imdbName }, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  
            }
        });
        setPos(response.data.positive_count);
        setNeg(response.data.negative_count);
        setLoading(false); // Set loading to false after the request
    } catch (error) {
        console.error("Error sending IMDb ID to backend:", error);
        setLoading(false); // Set loading to false in case of error
    }
};




  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 0) {
      loadMovies(value.trim());
    } else {
      setMovies([]);
    }
  };

  const handleSelect = (movie) => {
    setQuery('');
    setMovies([]);
    loadMovieDetails(movie.imdbID);
  };

  return (
    <div>
      <style>
        {`
          input {
            padding: 10px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            width: 100%;
            background-color: #333;
            color: #fff;
          }
          ul {
            list-style: none;
            padding: 0;
            background-color: #333;
            color: #fff;
            border-radius: 5px;
            margin-top: 5px;
            max-height: 200px;
            overflow-y: auto;
          }
          li {
            padding: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
          }
          li:hover {
            background-color: #444;
          }
          .search-item-thumbnail img {
            max-width: 50px;
            margin-right: 10px;
          }
          .movie-poster img {
            max-width: 100%;
            border-radius: 5px;
          }
          .movie-info {
            margin-top: 20px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
          .movie-details {
            flex: 1;
            margin-right: 20px;
          }
          .sentiment-analysis {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .sentiment-buttons {
            display: flex;
            gap: 10px;
            margin: 20px;
          }
          .positive-button,
          .negative-button {
            padding: 10px 20px;
            font-size: 1.2em;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease, opacity 0.3s ease;
            border-radius: 5px;
            color: black;
            margin-right: 10px;
          }
          .positive-button {
            background-color: #c3e6cb;
          }
          .negative-button {
            background-color: #f5c6cb;
          }
          .positive-button:hover,
          .negative-button:hover {
            opacity: 0.9;
          }
          .excel-button {
            padding: 10px 20px;
            font-size: 1.2em;
            font-weight: bold;
            margin: 10px;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease, opacity 0.3s ease;
            border-radius: 5px;
            color: black;
            background-color: #007bff;
          }
          .excel-button:hover {
            opacity: 0.8;
          }
          .imdb-button {
            margin: 20px;
          }
        `}
      </style>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for a movie..."
        />
        {movies.length > 0 && (
          <ul>
            {movies.map((movie) => (
              <li key={movie.imdbID} onClick={() => handleSelect(movie)}>
                <div className="search-item-thumbnail">
                  <img src={movie.Poster !== "N/A" ? movie.Poster : "image_not_found.png"} alt={movie.Title} />
                </div>
                <div className="search-item-info">
                  <h3>{movie.Title}</h3>
                  <p>{movie.Year}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
      {selectedMovieDetails && (
        <div className="movie-info">
          <div className="movie-details">
            <div className="movie-poster">
              <img src={selectedMovieDetails.Poster !== "N/A" ? selectedMovieDetails.Poster : "image_not_found.png"} alt={selectedMovieDetails.Title} />
            </div>
            <div className="movie-details-content">
              <h3 className="movie-title">{selectedMovieDetails.Title}</h3>
              <ul className="movie-misc-info">
                <li className="year">Year: {selectedMovieDetails.Year}</li>
                <li className="released">Released: {selectedMovieDetails.Released}</li>
                <li className="awards"><b><i className="fas fa-award"></i></b> {selectedMovieDetails.Awards}</li>
              </ul>
            </div>
          </div>
          <div className="sentiment-analysis">
            {loading ? (
              <Loader />
            ) : (
              <div>
                {(pos > 0 || neg > 0) && (
                  <div>
                    <PieChart
                      series={[
                        {
                          arcLabel: (item) => `${item.label} (${item.value})`,
                          data,
                          innerRadius: 30,
                          outerRadius: 100,
                          paddingAngle: 5,
                          cornerRadius: 5,
                          startAngle: -180,
                          endAngle: 180,
                          cx: 150,
                          cy: 150,
                        }
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: 'white',
                          fontWeight: 'bold',
                        },
                      }}
                      {...size}
                    />
                  </div>
                )}
                <div className="sentiment-buttons">
                  <button className="positive-button">
                    Positive Sentiments ({pos})
                  </button>
                  <button className="negative-button">
                    Negative Sentiments ({neg})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

