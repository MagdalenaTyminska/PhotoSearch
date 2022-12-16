import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import _debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchForm = document.querySelector('form#search-form');
const inputSearch = document.querySelector("input[name='searchQuery']");
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('input', _debounce(inputListener, DEBOUNCE_DELAY));

inputSearch.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
});

async function inputListener(event) {
  const searchQuery = event.target.value;
  const imageList = await getImages(searchQuery, API_KEY);

  const createGallery = imageList.hits
    .map(
      ({ previewURL, largeImageURL, tags }) =>
        `<a class="gallery__item" href=${largeImageURL}>
        <img class="gallery__image" src=${previewURL} alt=${tags}>
      </a>`
    )
    .join('');

  gallery.insertAdjacentHTML('afterbegin', createGallery);

  const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

var API_KEY = '32105928-babf9526dde61d2d51f562299';

async function getImages(query, API_KEY) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: `${API_KEY}`,
        q: `${query}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}