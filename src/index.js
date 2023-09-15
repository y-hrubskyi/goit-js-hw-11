import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '39469696-20028cb0579d07044da7a8037';
const BASE_URL = 'https://pixabay.com/api';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const per_page = 40;
let page = 1;
let searchQuery = '';
let lightbox = null;

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onSearchFormSubmit(event) {
  event.preventDefault();
  refs.galleryContainer.innerHTML = '';
  refs.loadMoreBtn.classList.add('visually-hidden');
  page = 1;

  searchQuery = event.currentTarget.elements.searchQuery.value;

  try {
    const results = await fetchSearchResults(searchQuery);
    if (!results.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.info(`Hooray! We found ${results.totalHits} images.`);
    renderSearchResults(results.hits);
    lightbox = new SimpleLightbox('.gallery a');

    if (results.hits.length < per_page) {
      return;
    }
    refs.loadMoreBtn.classList.remove('visually-hidden');
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  page += 1;

  try {
    const results = await fetchSearchResults(searchQuery);
    renderSearchResults(results.hits);
    lightbox.refresh();

    if (results.totalHits <= page * per_page) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notify.warning(
        "We're sorry, but you've reached the end of search results.",
        { position: 'right-bottom' }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function createSearchResultMarkup(item) {
  return `<div class="photo-card">
        <a href="${item.largeImageURL}">
          <div class="thumb">
              <img src="${item.webformatURL}" alt="${item.tag} loading="lazy" />
          </div>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span class="stats-quantity">${item.likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span class="stats-quantity">${item.views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span class="stats-quantity">${item.comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span class="stats-quantity">${item.downloads}</span>
          </p>
        </div>
      </div>`;
}

function renderSearchResults(array) {
  const markup = array.map(createSearchResultMarkup).join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

async function fetchSearchResults(searchQuery) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page,
    page,
  });
  const url = `${BASE_URL}/?${searchParams}`;

  const response = await axios(url);
  return response.data;
}
