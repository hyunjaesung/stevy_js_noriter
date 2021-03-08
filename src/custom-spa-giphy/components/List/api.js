export const getApiURL = ({ limit = 20, offset = 0 }) =>
  `http://api.giphy.com/v1/stickers/trending?api_key=pXe35kKu1sVdmsYyAXXiBWgZP2LMr60T&limit=${limit}&offset=${offset}`;

export const getGifData = async ({ limit = 20, offset = 0 }) => {
  const response = await fetch(getApiURL({ limit, offset }));
  let result = await response.json();
  return result;
};
