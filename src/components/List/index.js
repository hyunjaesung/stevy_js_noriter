import Dom from "../Dom";
import throttle from "../../utils/throttle";
import { getGifData } from "./api";
import template from "./template";

let _state = { apiData: [], page: 0, hasPagination: true };
let _isFirstRender = true;
let _root = null;
let _components = [];

const LIMIT = 30;

function infiniteScrollHandler(e) {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight * 0.8) {
    this.render();
  }
}

const clickHandler = (e) => {
  const gifWrapper = e.target.closest(".gif_item");
  if (!gifWrapper) return;
  const modal = gifWrapper.querySelector(".modal");
  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
};

const List = {
  async beforeRender() {
    const {
      data,
      pagination: { total_count },
    } = await getGifData({
      limit: LIMIT,
      offset: _state.page * LIMIT,
    });
    _state.page += 1;
    _state.apiData = [..._state.apiData, ...data];
    if (total_count - LIMIT <= _state.page * LIMIT) {
      _state.hasPagination = false;
    }
  },

  async render({ root, props = {} } = {}) {
    if (root) {
      _root = root;
    } else if (_root === null) {
      _root = document.querySelector("#div");
    }
    if (!_root) return;

    await this.beforeRender();
    Dom.print(_root, template({ ..._state, ...props }));
    this.afterRender();
    _isFirstRender = false;
  },

  afterRender() {
    const infiniteHandler = throttle(infiniteScrollHandler.bind(this), 1000);
    if (_isFirstRender) {
      window.addEventListener("scroll", infiniteHandler);
      window.addEventListener("click", clickHandler);
    } else if (!_state.hasPagination) {
      window.removeEventListener("scroll", infiniteHandler);
    }
  },
};

export default List;
