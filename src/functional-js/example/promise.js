const MyPromise = class {
  constructor(executor) {
    this.executor = executor;
    this.state = "pending";
    this.thenCallbacks = [];
    this.executor(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(value) {
    this.value = value;
    this.state = "resolved";
    this.thenCallbacks.forEach((callback) => {
      this.value = callback(this.value);
    });
  }
  then(callback) {
    if (this.state === "pending") {
      this.thenCallbacks.push(callback);
    }
    return this;
  }
  reject(error) {}
  catch(error) {}
};

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("첫번째 프로미스");
  }, 1000);
})
  .then((value) => {
    // this.value ( resolve 함수의 argument )
    // callback 이 실행되지 않기 때문에 콘솔에 안찍힘
    console.log("1", value); // 나중에 비동기 resolve가 실행된 후 그때 callback이 실행됨
    return "두번째 프로미스";
  })
  .then((value) => {
    // this.value ( 이전 then 콜백 의 return 값 )가 then의 콜백에 전달됨
    console.log("2", value);
  });
