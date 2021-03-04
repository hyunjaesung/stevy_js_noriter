import type from "../utils/type";
import Dom from "../Dom";

let _components = []; // {route, component}[]
let _routerDom = null;

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
  setRouter(components = []) {
    window.addEventListener("DOMContentLoaded", this.render);
    _components = [...components];
    return '<div id="router"></div>';
  },

  render() {
    if (_routerDom === null) {
      _routerDom = document.querySelector("#router");
    }

    const cur = getCurComponent();
    if (cur === undefined) {
      window.location.href = window.location.origin;
    } else {
      Dom.print(_routerDom, `${cur.component}`);
    }
  },

  routing(route, _ = type(route, "string")) {
    window.history.replaceState(null, "", route);
    this.render();
  },
};

export default Router;
