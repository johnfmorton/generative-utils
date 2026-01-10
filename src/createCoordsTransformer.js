/**
 * Create a function that transforms mouse/pointer event coordinates
 * into SVG coordinate space. Useful for interactive SVG applications.
 *
 * @param {SVGSVGElement} svg - The SVG element to transform coordinates for
 * @returns {function(MouseEvent): {x: number, y: number}} Transform function that converts event coords to SVG coords
 * @example
 * const transform = createCoordsTransformer(svgElement)
 * svg.addEventListener('mousemove', (e) => {
 *   const { x, y } = transform(e)
 *   // x, y are now in SVG coordinate space
 * })
 */
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
