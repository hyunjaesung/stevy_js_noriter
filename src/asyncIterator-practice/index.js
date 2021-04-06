// 우리의 목적
// api1 은 1초 api2는 5초 api3은 2초 걸릴때 호출은 병렬적으로 하더라도 그리는 순서는 1 2 3 순서
// 다중 비동기 데이터 로드와 렌더 로직 각각 함수로 따로 분리

/**
 * Promise.all을 이용해 병렬적으로 구현한 코드
 * 가장 늦은 놈 기준으로 끝내고 순차적으로 render
 * async await랑 안 어울리고 분리도 쉽지 않다
 */

// const render = (...urls) => {
//   Promise.all(urls.map(url => fetch(url).then(res => res.json()))).then(arr => {
//     console.log(arr);
//   });
// };

// /**
//  * 그냥  sequential 하게 처리한 코드
//  * 분리가 안 되어 있다
//  */

// const render = (...url) => {
//   const loop = () => {
//     if (url.length) {
//       fetch(url.shift())
//         .then(res => res.json())
//         .then(json => {
//           console.log(json);
//           loop();
//         });
//     }
//   };
//   loop();
// };

// /**
//  * Generator & Executor 패턴
//  * async 가 나오기 전 다중 비동기 데이터 처리와 렌더 분리법
//  */

// // 개선전 코드
// const dataLoader = function* (f, ...urls) {
//   for (const url of urls) {
//     const json = yield fetch(url).then(res => res.json());
//     f(json);
//   }
// };
// const render = (...urls) => {
//   const iter = dataLoader(console.log, ...urls);
//   const next = ({ value, done }) => {
//     if (!done) value.then(res => next(iter.next(res)));
//   };

//   next(iter.next());
// };

// // 개선후 코드
// const dataLoader = function* (f, ...urls) {
//   for (const url of urls) {
//     const json = yield fetch(url).then(res => res.json());
//     yield json;
//   }
// };
// const render = (...urls) => {
//   const iter = dataLoader(...urls);
//   const next = ({ value, done }) => {
//     if (!done) {
//       if (value instanceof Promise) {
//         value.then(data => next(iter.next(data)));
//       } else {
//         console.log(value);
//         next(iter.next());
//       }
//     }
//   };

//   next(iter.next());
// };

// /**
//  * async 만 이용했을 경우
//  * 분리가 안되어 있다
//  */

// // async 전
// const render = function (...urls) {
//   for (const url of urls) {
//     fetch(url).then(res => console.log(res.json()));
//     //   .then((result) => console.log(result));
//   }
// };

// // async 후
// const render = async function (...urls) {
//   for (const url of urls) {
//     const res = await fetch(url);
//     const result = await res.json();
//     console.log(result);
//   }
// };

// /**
//  * async generator 사용
//  * 데이터 로드와 렌더 분리
//  */

// const dataLoader = async function* (...urls) {
//   for (const url of urls) {
//     const res = await fetch(url);
//     yield await res.json();
//   }
// };

// const render = async function (...urls) {
//   for await (const json of dataLoader(...urls)) {
//     console.log(json);
//   }
// };

// /**
//  * yield * 연습
//  * yield * 뒤에는 generator or iterable만 올수 있다
//  * 함수 플로우상 yield * 순서에 해당 iterable에 yield 위임 한다
//  * yield * 순서에 해당 함수의 next() 시전 하면 위임된 iterable 값 반환
//  */

// function* func1() {
//   yield 42;
//   yield 22;
//   yield 11;
// }

// function* func2() {
//   // case1
//   yield* func1();
//   // 42 22 11출력

//   // case2
//   yield* (() => {
//     return 10;
//   })();
//   // Uncaught TypeError: yield* (intermediate value) is not iterable 에러

//   // case3
//   yield* 10;
//   // Uncaught TypeError: undefined is not a function 에러

//   // case4
//   yield* [1, 2, 3];
//   // 1, 2, 3 출력

//   // case5
//   yield 0;
//   yield* [1, 2, 3];
//   yield 4;
//   // 0 1 2 3 4 출력
// }

// const iter = func2();

// for (const value of iter) {
//   console.log(value);
// }

// /**
//  * yield * 이용한 위임을 통해서 한번 더 분리
//  */

// const urlLoader = async function* (url) {
//   const res = await fetch(url);
//   yield await res.json();
// };
// const dataLoader = async function* (...urls) {
//   for (const url of urls) {
//     yield* urlLoader(url);
//     // dataLoader 가 urlLoader에게 위임
//   }
// };
// const render = async function (...urls) {
//   for await (const json of dataLoader(...urls)) {
//     // dataLoader에게서 위임 받은 urlLoader 의 yield가 여기서 나온다
//     console.log(json);
//   }
// };

// render(
//   "http://localhost:3000/1",
//   "http://localhost:3000/2",
//   "http://localhost:3000/3",
//   "http://localhost:3000/4"
// );

// const delay = (delayTime) => {
//   const start = performance.now();
//   while (performance.now() - start < delayTime) {}
// };

// const fakeFetch = (delayTime) => {
//   console.log(delayTime + "start");
//   delay(delayTime);
//   console.log("finish");
//   return new Promise((resolve, _) => {
//     console.log(delayTime + "resloved");
//     resolve({
//       json() {
//         return new Promise((resolve, _) => {
//           resolve(`fake takes ${delayTime}`);
//         });
//       },
//     });
//   });
// };
// // async generator 이용
// // const getData = async function* (...times) {
// //   console.log(4);
// //   for (const time of times) {
// //     console.log(5);
// //     const res = await fakeFetch(time);
// //     console.log(6);
// //     yield await res.json();
// //     console.log(7);
// //   }
// // };

// // const render = async function (...times) {
// //   for await (const result of getData(...times)) {
// //     console.log(result);
// //   }
// // };

// // Promise All 이용
// // const getData = (...times) => {
// //   return Promise.all(
// //     times.map((time) => fakeFetch(time).then((res) => res.json()))
// //   );
// // };

// // const render = (...times) => {
// //   getData(...times).then((result) => {
// //     console.log(result);
// //   });
// // };

// // async 만 이용

// const render = async (...times) => {
//   for (const time of times) {
//     const res = await fakeFetch(time);
//     const result = await res.json();
//     console.log(result);
//   }
// };

// render(1000, 5000);
