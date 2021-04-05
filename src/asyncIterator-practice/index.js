import { func } from "prop-types";

/**
 * Promise.all을 이용해 병렬적으로 구현한 코드
 */

// const render = (...urls) => {
//   Promise.all(urls.map((url) => fetch(url).then((res) => res.json()))).then(
//     (arr) => {
//       console.log(arr);
//     }
//   );
// };

/**
 *  sequential 하게 처리한 코드
 */

// const render = (...url) => {
//   const loop = () => {
//     if (url.length) {
//       fetch(url.shift())
//         .then((res) => res.json())
//         .then((json) => {
//           console.log(json);
//           loop();
//         });
//     }
//   };
//   loop();
// };

/**
 * Generator & Executor 패턴
 */

// 개선전 코드
// const dataLoader = function* (f, ...urls) {
//   for (const url of urls) {
//     const json = yield fetch(url).then((res) => res.json());
//     f(json);
//   }
// };
// const render = (...urls) => {
//   const iter = dataLoader(console.log, ...urls);
//   const next = ({ value, done }) => {
//     if (!done) value.then((res) => next(iter.next(res)));
//   };

//   next(iter.next());
// };

// 개선후 코드
// const dataLoader = function* (f, ...urls) {
//   for (const url of urls) {
//     const json = yield fetch(url).then((res) => res.json());
//     yield json;
//   }
// };
// const render = (...urls) => {
//   const iter = dataLoader(...urls);
//   const next = ({ value, done }) => {
//     if (!done) {
//       if (value instanceof Promise) {
//         value.then((data) => next(iter.next(data)));
//       } else {
//         console.log(value);
//         next(iter.next());
//       }
//     }
//   };

//   next(iter.next());
// };

/**
 * async 만 이용했을 경우
 */

// async 전
// const render = function (...urls) {
//   for (const url of urls) {
//     fetch(url).then((res) => console.log(res.json()));
//     //   .then((result) => console.log(result));
//   }
// };

// async 후
// const render = async function (...urls) {
//   for (const url of urls) {
//     const res = await fetch(url);
//     const result = await res.json();
//     console.log(result);
//   }
// };

render(
  "http://localhost:3000/1",
  "http://localhost:3000/2",
  "http://localhost:3000/3",
  "http://localhost:3000/4"
);
