/**
 * Math tool for geometry
 * @class GeometricMath
 */
class GeometricMath {
  constructor() {
  }
  /**
   * Get size of a polygon
   * @method getPolygonSize
   * @param {position[]} vertices
   * @return {size}
   */
  getPolygonSize(vertices) {
    var x1 = vertices[0].x,
        x2 = vertices[0].x,
        y1 = vertices[0].y,
        y2 = vertices[0].y,
        i = 1,
        length = vertices.length;

    for(; i < length; i++) {
      x1 = Math.min(vertices[i].x, x1);
      x2 = Math.max(vertices[i].x, x2);
      y1 = Math.min(vertices[i].y, y1);
      y2 = Math.max(vertices[i].y, y2);
    }

    return {
      dx : x2 - x1,
      dy : y2 - y1
    };
  }
  /**
   * Get size of a circle
   * @method getCircleSize
   * @param {number} radius
   * @return {size}
   */
  getCircleSize(radius) {
    var diameter = radius * 2;

    return {
      dx : diameter,
      dy : diameter
    };
  }
  /**
   * Get new position with angle
   * @method getRotatedPoint
   * @param {position} position
   * @param {number} angle
   * @param {position} center
   * @return {position}
   */
  getRotatedPoint(position, angle, center) {
    var distance = {
          x : position.x - center.x,
          y : position.y - center.y
        },
        cos = Math.cos(angle),
        sin = Math.sin(angle);

    return {
      x : (cos * distance.x) - (sin * distance.y) + center.x,
      y : (sin * distance.x) + (cos * distance.y) + center.y
    };
  }
}
