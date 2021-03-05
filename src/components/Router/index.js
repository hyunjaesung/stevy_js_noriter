import type from "../../utils/type";

let _components = []; // {route, component}[]
let _root = null;

const deleteSlash = (string = "") => {
  if (string === "/") return string;

  let result = string;

  if (result[result.length - 1] === "/") {
    result = result.slice(0, result.length - 1);
  }
  if (result[0] === "/") {
    result = result.slice(1);
  }
  return result;
};

const getPathName = () => {
  return deleteSlash(window.location.pathname);
};

const getCurComponent = () => {
  const path = getPathName();
  return _components.find(({ route, _ }) => {
    const _route = route !== "/" ? deleteSlash(route) : "/";
    if (_route.includes("/:")) {
      return path.includes(_route.slice(0, _route.indexOf("/:") + 1));
    } else {
      return _route === "/" ? path === _route : path.includes(_route);
    }
  });
};

const Router = {
  init(components = []) {
    window.addEventListener("DOMContentLoaded", this.render);
    _components = [...components];
    return '<div id="router"></div>';
  },

  render() {
    if (_root === null) {
      _root = document.querySelector("#router");
    }

    const { component } = getCurComponent();
    if (component === undefined) {
      window.location.href = window.location.origin;
    } else {
      component.render({ root: _root });
    }
  },

  routing(route, _ = type(route, "string")) {
    window.history.replaceState(null, "", route);
    this.render();
  },
};

export default Router;
