import axios from "axios";

const API_KEY = '48302509-34d9f74736e571fd8f4b83a25';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = (searchedQuery, currentPage) => {
  const axiosOptions = {
    params: {
      key: API_KEY,
      q: searchedQuery,
      per_page: 15,
      page: currentPage,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  };
   
  return axios.get(`${BASE_URL}`, axiosOptions);
};
