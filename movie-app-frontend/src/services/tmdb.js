import axios from 'axios';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

export const getPopularMovies = async () => {
  const res = await tmdb.get('/movie/popular', {
    params: {
      api_key: process.env.REACT_APP_TMDB_API_KEY,
      language: 'en-US',
      page: 1,
    },
  });
  return res.data.results;
};
