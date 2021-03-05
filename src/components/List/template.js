const Item = ({ url }) => `
        <div class="gif_item">
            <div class="thumb" style="background: url(${url}) no-repeat center center"></div>
        </div>
    `;

const List = ({ apiData }) => {
  return `
  <div class="gif_list">
    ${apiData.reduce((acc, { images: { downsized_medium: { url } } }) => {
      acc += Item({ url });
      return acc;
    }, "")}
  </div>
  `;
};

export default List;
