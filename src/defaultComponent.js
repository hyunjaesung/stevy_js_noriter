import Dom from "../../Dom";

let _state = {};
let _root = null;
let _components = [];

const template = () => `
    <span>Component</span>
`;

const Component = {
  init() {
    // 따로 외부에 root 설정 하거나 의존성 필요한 컴퍼넌트 넣거나 할때
    window.addEventListener("DOMContentLoaded", this.render);
    return `<div id="component" ></div>`;
  },

  beforeRender() {}, // 렌더전에 state에 값 넣거나 할때

  render({ root, props = {} }) {
    if (root) {
      _root = root;
    } else if (_root === null) {
      _root = document.querySelector("#div");
    }

    this.beforeRender();
    Dom.print(_root, template({ ..._state, ...props }));
    this.afterRender();
  },

  afterRender() {}, // mount 후에 이벤트 걸거나 할때
};

export default Component;
