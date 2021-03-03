export const getQueryParam = () => {
  const index = window.location.hash.indexOf("?");
  const query = window.location.hash.slice(index + 1);
  return query.split("&").reduce((acc, item) => {
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
