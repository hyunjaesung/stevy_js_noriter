import steveact from "./steveact";

// 사용 코드
const element = steveact.createElement("h1", {}, "Steveact");
const root = document.getElementById("root");

steveact.render(element, root);
