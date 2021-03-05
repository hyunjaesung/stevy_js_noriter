import Dom from "../../Dom";

let _state = {};
let _root = null;
let _isFirstRender = true;
let _injection = [];

const template = () => `
    <span>Component</span>
`;

const Component = {
  init(injection) {
    // 따로 외부에 root 설정 하거나 의존성 필요한 컴퍼넌트 넣거나 할때
    window.addEventListener("DOMContentLoaded", this.render);
    return `<div id="component" ></div>`;
  },

  _beforeRender() {}, // 렌더전에 state에 값 넣거나 할때

  render({ root, props = {} } = {}) {
    if (root) {
      _root = root;
    } else if (_root === null) {
      _root = document.querySelector("#component");
      if (!_root) throw new Error("Root component is needed for rendering");
    }

    this._beforeRender();
    Dom.print(_root, template({ ..._state, ...props }));
    this._afterRender();
    _isFirstRender = false;
  },

  _afterRender() {}, // mount 후에 이벤트 걸거나 할때
};

export default Component;
