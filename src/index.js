// Test import of styles
// import "./styles/index.scss";

import Router from "./Router";
import Dom from "./Dom";
import Header from "./components/Header";
import List from "./components/List";

Dom.print(
  document.querySelector("#root"),
  `${Header.init()}${Router.init([{ route: "/", component: List }])}`
);
