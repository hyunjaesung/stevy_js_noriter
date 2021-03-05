const Item = ({ url }) => `
        <div class="gif_item">
          <div class="thumb" style="background: url(${url}) no-repeat center center"></div>
            <div class="modal hidden">
              <div class="modal__overlay"></div>
              <div class="modal__content">
                <div class="modal__image" style="background: url(${url}) no-repeat center center"></div>
              </div>
            </div>
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
