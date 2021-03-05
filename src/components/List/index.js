import Dom from "../Dom";
import throttle from "../../utils/throttle";
import { getGifData } from "./api";
import template from "./template";
import { clickHandler, infiniteScrollHandler, IOHandler } from "./eventHandler";

let _state = { apiData: [], page: 0, hasPagination: true };
let _isFirstRender = true;
let _root = null;
let _components = [];

const LIMIT = 30;

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
    _state.apiData = [...data];
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
    Dom.print(
      _root,
      _state.page > 1
        ? `${_root.innerHTML}${template({ ..._state, ...props })}`
        : template({ ..._state, ...props })
    );
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
    IOHandler();
  },
  clean() {
    _state = { apiData: [], page: 0, hasPagination: true };
    _isFirstRender = true;
    _root = null;
    _components = [];
  },
};

export default List;
