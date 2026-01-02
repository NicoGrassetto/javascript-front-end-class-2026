const everyLoop = function (arr, predicateFct) {
  for (let i = 0; i < arr.length; i++) {
    if (!predicateFct(arr[i])) {
      return false;
    }
  }
  return true;
};

const everySome = function (arr, predicateFct) {
  return !arr.some(function (element) {
    return !predicateFct(element);
  });
};

const every = everyLoop;
