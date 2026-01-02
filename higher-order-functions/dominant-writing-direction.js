function dominantWritingDirection(text) {
  const ltrCount = 0;
  const rtlCount = 0;
  const top2Bottom = 0;

  for (let char of text) {
    if (char.direction === "ltr") {
      ltrCount++;
    } else if (char.direction === "rtl") {
      rtlCount++;
    } else {
      top2Bottom++;
    }
  }
}

function dominantWritingDirection(text) {
  const counts = { ltr: 0, rtl: 0, ttb: 0 };

  for (const char of text) {
    const codePoint = char.codePointAt(0);
    const script = characterScript(codePoint); // requires the helper from the book
    if (!script) continue;

    if (script.direction === "ltr") counts.ltr++;
    else if (script.direction === "rtl") counts.rtl++;
    else if (script.direction === "ttb") counts.ttb++;
  }

  const dominant = Object.entries(counts).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["ltr", 0],
  );

  return dominant[1] === 0 ? "ltr" : dominant[0];
}
