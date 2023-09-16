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

function renderSearchResults(array, container) {
  const markup = array.map(createSearchResultMarkup).join('');
  container.insertAdjacentHTML('beforeend', markup);
}

export { renderSearchResults };
