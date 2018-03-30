import Polygon from '../../../api/layer2/Polygon.js';

describe('Polygon', function () {

    var polygon;

    beforeEach(function () {
        polygon = new Polygon();
    });

    describe('constructor', function () {

        it('should generate an Polygon object', function() {
            // Given
            var type = "Polygon",
                vertices = [],
                geometricMath = new GeometricMath();

            // When
            polygon = new Polygon();

            // Then
            expect(polygon.type).toEqual(type);
            expect(polygon.vertices).toEqual(vertices);
            expect(polygon.geometricMath).toEqual(geometricMath);
        });

    });

    describe('updateSize', function () {

        it('should update size property with getPolygonSize return value', function() {
          // Given
          var geometricMath = new GeometricMath(),
              polygonProperties = {
                vertices : [
                  {
                    x : 10,
                    y : 5
                  },
                  {
                    x : 13,
                    y : 10
                  },
                  {
                    x : 8,
                    y : 15
                  }
                ],
                color : "red",
                borderColor : "blue",
                borderSize : 18
              },
              size = geometricMath.getPolygonSize(polygonProperties.vertices);

          polygon = new Polygon();
          polygon.setGeometry(polygonProperties);

          // When
          spyOn(polygon.geometricMath, 'getPolygonSize').and.callThrough();

          polygon.updateSize();

          // Then
          expect(polygon.geometricMath.getPolygonSize).toHaveBeenCalledWith(polygon.vertices);
          expect(polygon.size).toEqual(size);
        });

    });

    describe('setGeometry', function () {

        it('should set polygon properties', function() {
          // Given
          var polygonProperties = {
            vertices : [
              {
                x : 10,
                y : 5
              },
              {
                x : 13,
                y : 10
              },
              {
                x : 8,
                y : 15
              }
            ],
            color : "red",
            borderColor : "blue",
            borderSize : 18
          };

          polygon = new Polygon();

          // When
          spyOn(polygon, 'updateSize');

          polygon.setGeometry(polygonProperties);

          // Then
          expect(polygon.vertices).toEqual(polygonProperties.vertices);
          expect(polygon.updateSize).toHaveBeenCalled();
        });

    });

    describe('show', function () {

        it('should display polygon on canvas', function() {
          // Given
          var center = {
                x : 0,
                y : 0
              },
              polygonProperties = {
                vertices : [
                  {
                    x : 10,
                    y : 5
                  },
                  {
                    x : 13,
                    y : 10
                  },
                  {
                    x : 8,
                    y : 15
                  }
                ],
                color : "#ffa500",
                borderColor : "#ffa500",
                borderSize : 5
              },
              position = {
                x : 10,
                y : 5
              },
              angle = 0.5,
              canvas = document.createElement('canvas'),
              canvasCtx = canvas.getContext('2d'),
              x = 0,
              length = polygon.vertices.length;

          polygon = new Polygon();
          polygon.setGeometry(polygonProperties);
          center.x = position.x + (polygon.size.dx / 2);
          center.y = position.y + (polygon.size.dy / 2);

          // When
          spyOn(canvasCtx, 'translate');
          spyOn(canvasCtx, 'rotate');
          spyOn(canvasCtx, 'beginPath');
          spyOn(canvasCtx, 'moveTo');
          spyOn(canvasCtx, 'lineTo');
          spyOn(canvasCtx, 'closePath');
          spyOn(canvasCtx, 'fill');
          spyOn(canvasCtx, 'stroke');

          polygon.show(position, angle, canvas, canvasCtx);

          // Then
          expect(canvasCtx.translate).toHaveBeenCalledWith(center.x, center.y);
          expect(canvasCtx.rotate).toHaveBeenCalledWith(angle);
          expect(canvasCtx.beginPath).toHaveBeenCalled();

          for (; x < length; x++) {
            expect(canvasCtx.moveTo).toHaveBeenCalledWith(
              polygon.vertices[x].x + position.x,
              polygon.vertices[x].y + position.y
            );
          }

          expect(canvasCtx.lineTo).toHaveBeenCalledWith(polygon.vertices[0].x + position.x, polygon.vertices[0].y + position.y);
          expect(canvasCtx.closePath).toHaveBeenCalled();

          expect(canvasCtx.fillStyle).toEqual(polygon.color);
          expect(canvasCtx.lineWidth).toEqual(polygon.borderSize);
          expect(canvasCtx.strokeStyle).toEqual(polygon.borderColor);

          expect(canvasCtx.fill).toHaveBeenCalled();
          expect(canvasCtx.stroke).toHaveBeenCalled();

          expect(canvasCtx.rotate).toHaveBeenCalledWith(-angle);
          expect(canvasCtx.translate).toHaveBeenCalledWith(-center.x, -center.y);
        });

    });

});
