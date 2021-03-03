// Test import of styles
// import "./styles/index.scss";

import Router from "./Router";
import dom from "./utils/dom";

dom(
  document.querySelector("#root"),
  "PinnerHTML",
  `${Router.setRouter([
    { route: "/", component: "<div>abc</div>" },
    { route: "/test/:id", component: "<div>test</div>" },
  ])}`
);
