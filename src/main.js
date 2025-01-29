import { createGalleryCardTemplate } from './js/render-functions';
import { fetchImages } from './js/pixabay-api';
import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';

const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more-btn');

let page = 1;
let searchedQuery = '';

let lightbox = new SimpleLightbox('.js-gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const toggleLoadMoreBtn = show => {
  if (show) {
    loadMoreBtnEl.classList.remove('is-hidden');
  } else {
    loadMoreBtnEl.classList.add('is-hidden');
  }
};

const onSearchFormSubmit = async event => {
  try {
    event.preventDefault();

    searchedQuery = event.currentTarget.elements.user_query.value.trim();

    if (searchedQuery === '') {
      iziToast.error({ message: 'The search field cannot be empty!' });
      return;
    }

    page = 1;
    galleryEl.innerHTML = ''; 
    toggleLoadMoreBtn(false);

    const { data } = await fetchImages(searchedQuery, page);

    if (data.totalHits === 0) {
      iziToast.warning({
        message: 'No images found. Please try another search query!',
      });
      return;
    }

    const galleryTemplate = data.hits.map(el => createGalleryCardTemplate(el)).join('');
    galleryEl.innerHTML = galleryTemplate;
    lightbox.refresh(); 

    if (data.hits.length < 15) {
      toggleLoadMoreBtn(false);
    } else {
      toggleLoadMoreBtn(true);
      loadMoreBtnEl.removeEventListener('click', onLoadMoreBtnClick);
      loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
    }

    iziToast.success({
      message: `Hooray! We found ${data.totalHits} images.`,
    });
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please check your internet connection or try again later.',
    });
    console.log('Error details:', err);
  }
};

const onLoadMoreBtnClick = async () => {
  try {
    page++;
    const { data } = await fetchImages(searchedQuery, page);

    const galleryTemplate = data.hits.map(el => createGalleryCardTemplate(el)).join('');
    galleryEl.insertAdjacentHTML('beforeend', galleryTemplate);
    lightbox.refresh();

    const maxPages = Math.ceil(data.totalHits / 15);
    if (page >= maxPages || data.hits.length < 15) {
      toggleLoadMoreBtn(false);
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
    }

    smoothScroll();
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please check your internet connection or try again later.',
    });
    console.log('Error details:', err);
  }
};

const smoothScroll = () => {
  const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
