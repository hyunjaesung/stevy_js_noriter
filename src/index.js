// Test import of styles
import "./styles/style.scss";

import Router from "./components/Router";
import Dom from "./components/Dom";
import Header from "./components/Header";
import List from "./components/List";

Dom.print(
  document.querySelector("#root"),
  `${Header.init()}${Router.init([{ route: "/", component: List }])}`
);
