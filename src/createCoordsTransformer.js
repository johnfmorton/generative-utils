function createCoordsTransformer(svg) {
  const pt = svg.createSVGPoint();

  return function (e) {
    pt.x = e.clientX;
    pt.y = e.clientY;

    const ctm = svg.getScreenCTM();
    if (ctm === null) {
      return { x: pt.x, y: pt.y };
    }

    return pt.matrixTransform(ctm.inverse());
  };
}

export { createCoordsTransformer };
