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
  if (el === root && el.innerHTML === "" && !el.outerHTML.includes("id=")) {
    return true;
  }
  const beforeHTML = root.outerHTML;
  const beforeEl = el.outerHTML;

  const [rootContainer, rootContainerClose] = beforeHTML.split(beforeEl);
  const [elContainer, elContainerClose] = beforeEl.split(el.innerHTML);

  const afterHTML = `${rootContainer}${elContainer}${tmpl}${elContainerClose}${rootContainerClose}`;

  return beforeHTML !== afterHTML;
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
