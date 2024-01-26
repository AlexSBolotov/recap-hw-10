import { CAT_API, BASE_URL } from './constant';

const fetchBreedsList = () => {
  return fetch(`${BASE_URL}breeds?api_key=${CAT_API}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {});
};
const fetchBreedData = id => {
  const searchParams = new URLSearchParams({
    breed_ids: id,
    api_key: CAT_API,
  });
  return fetch(`${BASE_URL}images/search?${searchParams}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      return data[0];
    })
    .catch(error => {});
};

export { fetchBreedsList, fetchBreedData };
