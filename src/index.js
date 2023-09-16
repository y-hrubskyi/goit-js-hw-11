// libraries
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';

// styles
import 'simplelightbox/dist/simple-lightbox.min.css';

// local modules
import { renderSearchResults } from './js/render-functions';
import { ThePixabayApiService } from './js/thepixabay-api-service';
import { refs } from './js/refs';

// code
const searchService = new ThePixabayApiService();
let lightbox = null;

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onSearchFormSubmit(event) {
  event.preventDefault();

  refs.galleryContainer.innerHTML = '';
  refs.loadMoreBtn.classList.add('visually-hidden');
  searchService.resetPage();

  searchService.searchQuery =
    event.currentTarget.elements.searchQuery.value.trim();
  if (!searchService.searchQuery) {
    Notify.warning('Your search request is empty');
    return;
  }

  try {
    const results = await searchService.fetchSearchResults();
    if (!results.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.info(`Hooray! We found ${results.totalHits} images.`, {
      timeout: 1700,
    });
    renderSearchResults(results.hits, refs.galleryContainer);
    lightbox = new SimpleLightbox('.gallery a');

    if (results.hits.length < searchService.perPage) {
      setTimeout(
        () =>
          Notify.warning(
            "We're sorry, but you've reached the end of search results.",
            { position: 'right-bottom' }
          ),
        2000
      );
      return;
    }
    refs.loadMoreBtn.classList.remove('visually-hidden');
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  searchService.incrementPage();

  try {
    const results = await searchService.fetchSearchResults();
    renderSearchResults(results.hits, refs.galleryContainer);
    lightbox.refresh();

    if (results.totalHits <= searchService.page * searchService.perPage) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      setTimeout(
        () =>
          Notify.warning(
            "We're sorry, but you've reached the end of search results.",
            { position: 'right-bottom' }
          ),
        1000
      );
    }
  } catch (error) {
    console.log(error);
  }
}
