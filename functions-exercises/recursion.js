function isEven(a) {
  if (a < 0 || a % 1 !== 0) throw Error("Input must be a non-negative integer");

  return a === 0 ? true : a === 1 ? false : isEven(a - 2);
}
