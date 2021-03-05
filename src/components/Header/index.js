import Dom from "../Dom";
import template from "./template";

let _state = null;
let _root = null;

const Header = {
  init() {
    window.addEventListener("DOMContentLoaded", this.render);
    return `<header id="header" ></header>`;
  },

  beforeRender() {},

  render() {
    if (_root === null) {
      _root = document.querySelector("#header");
    }
    Dom.print(_root, template());
  },

  afterRender() {},
};

export default Header;
