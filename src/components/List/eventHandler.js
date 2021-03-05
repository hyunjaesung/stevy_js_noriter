export function infiniteScrollHandler(e) {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight * 0.8) {
    this.render();
  }
}

export const clickHandler = (e) => {
  const gifWrapper = e.target.closest(".gif_item");
  if (!gifWrapper) return;
  const modal = gifWrapper.querySelector(".modal");
  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
};

export const IOHandler = () => {
  const lazyImages = [].slice.call(document.querySelectorAll("div.lazy"));
  let lazyImageObserver = new IntersectionObserver(function (
    entries,
    observer
  ) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        let lazyImage = entry.target;
        if (lazyImage.style.backgroundImage === `url("")`) {
          lazyImage.style.backgroundImage = `url(${lazyImage.dataset.imgurl})`;
        }
        lazyImage.classList.remove("lazy");
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach(function (lazyImage) {
    lazyImageObserver.observe(lazyImage);
  });
};
