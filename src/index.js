// Test import of styles
// import "./styles/index.scss";

import Router from "./Router";
import Dom from "./Dom";

Dom.print(
  document.querySelector("#root"),
  `${Router.setRouter([
    { route: "/", component: "<div>abc</div>" },
    { route: "/test/", component: "<div>test</div>" },
  ])}`
);
