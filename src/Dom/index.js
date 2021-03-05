const domController = (el, ...arg) => {
  let k;
  arg.forEach((it) => {
    if (!k) {
      k = it;
    } else {
      switch (k[0]) {
        case "A":
          el.setAttribute(k.substr(1), it);
          break;
        case "P":
          el[k.substr(1)] = it;
          break;
        default:
          el.style[k] = it;
      }
      k = undefined;
    }
  });
  return el;
};

let root = null;

const shouldUpdate = (el, tmpl) => {
  return el.innerHTML !== tmpl;
};

const Dom = {
  print(el, tmpl) {
    if (root === null) {
      root = document.querySelector("#root");
    }
    const startUpdate = shouldUpdate(el, tmpl);

    if (startUpdate) {
      domController(el, "PinnerHTML", tmpl);
    }
  },
};

export default Dom;
