/**
 * Math tool for geometry
 * @class GeometricMath
 */
class GeometricMath {
  /**
   * Get size of a polygon
   * @method getPolygonSize
   * @param {position[]} vertices - Vertices of the polygon
   * @return {size} - Size of the polygon
   */
  static getPolygonSize(vertices) {
    const polygonBox = GeometricMath.getPolygonBox(vertices);

    return {
      dx: polygonBox.x2 - polygonBox.x1,
      dy: polygonBox.y2 - polygonBox.y1
    };
  }
  /**
   * Get size of a polygon
   * @method getPolygonSize
   * @param {position[]} vertices - Vertices of the polygon
   * @return {box} - Box polygon
   */
  static getPolygonBox(vertices) {
    const polygonBox = {
      x1: vertices[0].x,
      x2: vertices[0].x,
      y1: vertices[0].y,
      y2: vertices[0].y
    };
    const verticesLength = vertices.length;

    for (let i = 1; i < verticesLength; i++) {
      polygonBox.x1 = Math.min(vertices[i].x, polygonBox.x1);
      polygonBox.x2 = Math.max(vertices[i].x, polygonBox.x2);
      polygonBox.y1 = Math.min(vertices[i].y, polygonBox.y1);
      polygonBox.y2 = Math.max(vertices[i].y, polygonBox.y2);
    }

    return polygonBox;
  }
  /**
   * Get size of a circle
   * @method getCircleSize
   * @param {number} radius - Radius of the circle
   * @return {size} - Size of the circle
   */
  static getCircleSize(radius) {
    const diameter = radius * 2;

    return {
      dx: diameter,
      dy: diameter
    };
  }
  /**
   * Get new position with angle
   * @method getRotatedPoint
   * @param {position} position - Position of the point
   * @param {number} angle - Angle
   * @param {position} center - Position of the center of rotation
   * @return {position} - Position of the rotated point
   */
  static getRotatedPoint(position, angle, center) {
    const distance = {
      x: position.x - center.x,
      y: position.y - center.y
    };
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
      x: (cos * distance.x) - (sin * distance.y) + center.x,
      y: (sin * distance.x) + (cos * distance.y) + center.y
    };
  }
  /**
   * Get new position with angle
   * @method getRotatedPolygon
   * @param {position[]} vertices - Vertices of the polygon
   * @param {number} angle - Angle of rotation
   * @param {position} center - Position of the center of rotation
   * @return {position[]} - Vertices Position of the rotated polygon
   */
  static getRotatedPolygon(vertices, angle, center) {
    const verticesLength = vertices.length;
    const rotatedVertices = [];

    for (let x = 0; x < verticesLength; x++) {
      rotatedVertices.push(this.getRotatedPoint(vertices[x], angle, center));
    }

    return rotatedVertices;
  }
}
