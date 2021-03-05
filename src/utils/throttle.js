function throttle(fn, wait) {
  var time = Date.now();
  return function (e) {
    if (time + wait - Date.now() < 0) {
      fn(e);
      time = Date.now();
    }
  };
}

export default throttle;
