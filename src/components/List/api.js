export const getApiURL = ({ limit = 20 }) =>
  `http://api.giphy.com/v1/gifs/trending?api_key=dqI1mYZENrgidCRXokUiSdq4Gs9vE7c5&limit=${limit}`;
