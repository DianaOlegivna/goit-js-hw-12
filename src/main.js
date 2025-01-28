import { createGalleryCardTemplate } from './js/render-functions';
import { fetchImages } from './js/pixabay-api';
import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';

const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more-btn');

let page = 1;
let searchedQuery = '';

let lightbox = new SimpleLightbox('.gallery-item', {
    captionsData: 'alt',
    captionDelay: 250,
});

const toggleLoading = isLoading => {
    if (isLoading) {
        galleryEl.innerHTML = '<p>Loading images, please wait...</p>'; 
    } else {
        galleryEl.innerHTML = '';
    }
};

const onSearchFormSubmit = async event => {
  try {
    event.preventDefault();

    searchedQuery = event.currentTarget.elements.user_query.value.trim();

    if (searchedQuery === '') {
      iziToast.error({ message: 'The search field cannot be empty!!' });

      return;
    }

    page = 1;
    toggleLoading(true);
    loadMoreBtnEl.classList.add('is-hidden');

    const { data } = await fetchImages(searchedQuery, page);

    if (data.totalHits === 0) {
        iziToast.warning({
            message: 'Sorry, there are no images matching your search query. Please try again!',
        });

      galleryEl.innerHTML = '';

      searchFormEl.reset();

      return;
    }

    if (data.totalHits > 1) {
      loadMoreBtnEl.classList.remove('is-hidden');

      loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
    }

    const galleryTemplate = data.hits.map(el => createGalleryCardTemplate(el)).join('');

    galleryEl.innerHTML = galleryTemplate;
     lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);

const onLoadMoreBtnClick = async event => {
  try {
    page++;

    const { data } = await fetchImages(searchedQuery, page);

    const galleryTemplate = data.hits.map(el => createGalleryCardTemplate(el)).join('');

    galleryEl.insertAdjacentHTML('beforeend', galleryTemplate);

    const maxPages = Math.ceil(data.totalHits / 15);
    if (page >= maxPages) {
      loadMoreBtnEl.classList.add('is-hidden');
      loadMoreBtnEl.removeEventListener('click', onLoadMoreBtnClick);
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
    }
    smoothScroll();
  } catch (err) {
    console.log(err);
  }
};

const smoothScroll = () => {
  const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};