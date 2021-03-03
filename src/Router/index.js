import type from "../utils/type";
import dom from "../utils/dom";

let _components = []; // {route, component}[]
let _routerDom = null;

const deleteSlash = (string = "") => {
  let result = string;

  if (result[result.length - 1] === "/") {
    result = result.slice(0, result.length - 1);
  }

  if (result[0] === "/") {
    result = result.slice(1);
  }
  return result;
};

const getHashPath = () => {
  if (window.location.hash === "") return "/";
  let result = window.location.hash.slice(1);
  if (result.includes("?")) {
    result = result.slice(0, result.indexOf("?") + 1);
  }
  result = deleteSlash(result);
  return result;
};

const Router = {
  setRouter(components = []) {
    window.addEventListener("hashchange", this.render);
    window.addEventListener("DOMContentLoaded", this.render);
    _components = [...components];
    return '<div id="router"></div>';
  },

  render() {
    if (_routerDom === null) {
      _routerDom = document.querySelector("#router");
    }
    const path = getHashPath();
    const cur = _components.find(({ route, _ }) => {
      const _route = route !== "/" ? deleteSlash(route) : "/";
      if (_route.includes("/:")) {
        return path.includes(_route.slice(0, _route.indexOf("/:") + 1));
      } else {
        console.log(path, _route);
        return _route === "/" ? path === _route : path.includes(_route);
      }
    });
    if (cur === undefined) {
      window.location.hash = "";
    } else {
      dom(_routerDom, "PinnerHTML", `${cur.component}`);
    }
  },

  routing(route, _ = type(route, "string")) {
    window.location.hash = route;
  },
};

export default Router;
