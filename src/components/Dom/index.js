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
          if (k.substr(1) === "classList") {
            if (el.classList.contains(it)) {
              el.classList.remove(it);
            } else {
              el.classList.add(it);
            }
          } else {
            el[k.substr(1)] = it;
          }
          break;
        default:
          el.style[k] = it;
      }
      k = undefined;
    }
  });
  return el;
};

let cur = {};

const Dom = {
  print(el, tmpl) {
    if (cur !== el) {
      // 이전 컴포넌트 초기화
      if (cur.clean) {
        cur.clean();
      }
      cur = el;
    }
    domController(el, "PinnerHTML", tmpl);
  },
  control(el, ...arg) {
    domController(el, ...arg);
  },
};

export default Dom;
