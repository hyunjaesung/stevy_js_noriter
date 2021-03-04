import Dom from "../../Dom";
import { getApiURL } from "./api";
import template from "./template";

let _state = {};
let _root = null;
let _components = [];

const List = {
  async beforeRender() {
    const response = await fetch(getApiURL({ limit: 20 }), {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    let result = await response.json();
    _state.apiData = result.data;
  },

  async render({ root, props = {} }) {
    if (root) {
      _root = root;
    } else if (_root === null) {
      _root = document.querySelector("#div");
    }
    if (!_root) return;

    await this.beforeRender();
    Dom.print(_root, template({ ..._state, ...props }));
    this.afterRender();
  },

  afterRender() {},
};

export default List;
