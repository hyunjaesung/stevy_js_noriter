const iterable = {
  i: [1, 2, 3, 4, 5],
  [Symbol.iterator]() {
    const ref = this;
    let index = 0;
    return {
      next() {
        return ref.i.length === index
          ? { done: true }
          : { value: ref.i[index++], done: false };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  },
};

let iter = iterable[Symbol.iterator]();

console.log(iter.next());
console.log(iter.next());

for (let value of iter) {
  console.log(value);
}

for (let value of iterable) {
  console.log(value);
}

// const arr = [1, 2, 3];

// let arrIter = arr[Symbol.iterator]();

// console.log(arr, arrIter);
