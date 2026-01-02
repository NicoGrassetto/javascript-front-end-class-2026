function range(start, end) {
  let array = [];
  for (let i = start; i <= end; i++) {
    array.push(i);
  }
  return array;
}

function sum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

console.log(range(1, 10));

function rangeIncrement(start, end, step) {
  let array = [];
  for (let i = start; i <= end; i += step) {
    array.push(i);
  }
  return array;
}
