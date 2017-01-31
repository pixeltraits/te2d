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
    var x1 = 0,
        x2 = 0,
        y1 = 0,
        y2 = 0,
        i = 0,
        length = this.vertices.length;

    for(; i < length; i++) {
      x1 = Math.min(this.vertices[i].x, x1);
      x2 = Math.max(this.vertices[i].x, x2);
      y1 = Math.min(this.vertices[i].y, y1);
      y2 = Math.max(this.vertices[i].y, y2);
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
