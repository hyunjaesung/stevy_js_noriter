export const getQueryParam = () => {
  return window.location.search
    .slice(1)
    .split("&")
    .reduce((acc, item) => {
      const [key, value] = item.split("=");
      if (key && value) {
        acc[window.decodeURIComponent(key)] = window.decodeURIComponent(value);
      }
      return acc;
    }, {});
};

export const getQueryString = (queryArr = []) => {
  let result = "?";
  queryArr.forEach((query, index) => {
    if (index !== queryArr.length - 1) {
      result += `${query}?`;
    } else {
      result += query;
    }
  });
  return result;
};
