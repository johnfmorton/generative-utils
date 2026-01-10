function map(n, start1, end1, start2, end2) {
  if (start1 === end1) {
    return start2;
  }
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

export { map };
