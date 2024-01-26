import { fetchBreedsList, fetchBreedData } from './partials/cat-api';

import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import './sass/index.scss';

// axios.defaults.headers.common['x-api-key'] = CAT_API;
const refs = {
  dirToLoad: document.querySelector('.cat-info'),
  selectWrapper: document.querySelector('#select-wrapper'),
  selectEl: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
};

const createOptions = breeds => {
  const breedOptions = [];
  breeds.map(breed => breedOptions.push({ text: breed.name, value: breed.id }));
  return breedOptions;
};

const onBreedSelect = info => {
  fetchBreedData(info[0].value)
    .then(onBreedSelectSuccess)
    .catch(onError)
    .finally(onFinally);
};
const onError = error => {
  Notify.failure('Oops! Something went wrong! Try reloading the page!');
};
const onFinally = () => {
  refs.dirToLoad.classList.remove('not-visible');
  refs.loader.style.display = 'none';
};
const onBreedSelectSuccess = data => {
  refs.loader.style.display = 'block';
  insertCatMarkup(data);
};
const insertCatMarkup = data => {
  const markup = createCatMarkup(data);
  refs.dirToLoad.insertAdjacentHTML('afterbegin', markup);
};
const clearMarkup = () => {
  refs.dirToLoad.innerHTML = '';
};
const createCatMarkup = data => {
  const { breeds, url } = data;
  return `
    <div class="cat-wrapper">
        <img width="400px" src=${url} alt=${breeds[0].name}/>
        <div>
          <h1>${breeds[0].name}</h1>
          <p>${breeds[0].description}</p>
        </div>
    </div>
    `;
};

fetchBreedsList()
  .then(breeds => {
    refs.loader.style.display = 'block';
    new SlimSelect({
      select: refs.selectEl,
      data: createOptions(breeds),
      events: {
        afterChange: breedInfo => {
          onBreedSelect(breedInfo);
        },
        beforeChange: () => clearMarkup(),
      },
    });
  })
  .catch(onError)
  .finally(() => {
    refs.loader.style.display = 'none';
    refs.selectWrapper.classList.remove('not-visible');
  });
