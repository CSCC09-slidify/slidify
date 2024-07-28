const module = {};

// checks token info
module.searchImages = async ({ apiKey, searchEngineId, query }) => {
  return fetch(
    `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&searchType=image`,
  )
    .then((res) => res.json())
    .then((data) => data.items);
};

export default module;
