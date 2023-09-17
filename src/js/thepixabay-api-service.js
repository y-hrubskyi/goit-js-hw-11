import axios from 'axios';

class ThePixabayApiService {
  #API_KEY;
  #BASE_URL;

  constructor() {
    this.page = 1;
    this.perPage = 40;
    this.searchQuery = '';

    this.#API_KEY = '39469696-20028cb0579d07044da7a8037';
    this.#BASE_URL = 'https://pixabay.com/api';
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
    const url = `${this.#BASE_URL}/?${searchParams}`;

    const response = await axios(url);
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}

export { ThePixabayApiService };
