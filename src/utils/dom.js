const dom = (el, ...arg) => {
  console.log(el, arg);
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
          console.log(k);
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

// const q = (sel, ...arg) => p(document.querySelector(sel), ...arg);
// const el = (tag, ...arg) => p(document.createElement(tag), ...arg);

export default dom;
