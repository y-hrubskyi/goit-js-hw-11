import axios from 'axios';
import { API_KEY, BASE_URL } from './constants';

class ThePixabayApiService {
  #API_KEY;
  #BASE_URL;

  constructor() {
    this.page = 1;
    this.perPage = 40;
    this.searchQuery = '';

    this.#API_KEY = API_KEY;
    this.#BASE_URL = BASE_URL;
  }

  async fetchSearchResults() {
    const searchParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: this.perPage,
      page: this.page,
    });
    const url = `${BASE_URL}/?${searchParams}`;

    const response = await axios(url);
    return response.data;
  }
}

export { ThePixabayApiService };
