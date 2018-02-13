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
    const polygonBox = this.getPolygonBox(vertices);

    return {
      dx: polygonBox.x2 - polygonBox.x1,
      dy: polygonBox.y2 - polygonBox.y1
    };
  }
  /**
   * Get size of a polygon
   * @method getPolygonSize
   * @param {position[]} vertices
   * @return {size}
   */
  static getPolygonBox(vertices) {
    let x1 = vertices[0].x;
    let x2 = vertices[0].x;
    let y1 = vertices[0].y;
    let y2 = vertices[0].y;

    const length = vertices.length;

    for (let i = 1; i < length; i++) {
      x1 = Math.min(vertices[i].x, x1);
      x2 = Math.max(vertices[i].x, x2);
      y1 = Math.min(vertices[i].y, y1);
      y2 = Math.max(vertices[i].y, y2);
    }

    return {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2
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
  /**
   * Get new position with angle
   * @method getRotatedPolygon
   * @param {position[]} vertices
   * @param {number} angle
   * @param {position} center
   * @return {position}
   */
  getRotatedPolygon(vertices, angle, center) {
    let verticesLength = vertices.length;
    let rotatedVertices = [];

    for(let x = 0; x < verticesLength; x++) {
      rotatedVertices.push(this.getRotatedPoint(vertices[x], angle, center));
    }

    return rotatedVertices;
  }
}
