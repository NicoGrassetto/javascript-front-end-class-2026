function loop(value, testFct, updateFct, bodyFct) {
  for (
    let currentValue = value;
    testFct(currentValue);
    currentValue = updateFct(currentValue)
  ) {
    bodyFct(currentValue);
  }
}
