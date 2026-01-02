function countBs(str) {
  let count = 0;
  str.forEach((char) => {
    if (char === "B") {
      count++;
    }
  });
  return count;
}

function countChar(str, char) {
  let count = 0;
  str.forEach((char) => {
    if (char === char) {
      count++;
    }
  });
  return count;
}

function countBs(str, charFn) {
  return charFn(str, "B");
}
