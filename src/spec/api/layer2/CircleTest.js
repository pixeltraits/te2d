import Circle from '../../../api/layer2/Circle.js';

describe('Circle', function () {

    var circle;

    beforeEach(function () {
        circle = new Circle();
    });

    describe('constructor', function () {

        it('should generate an Circle object', function() {
            // Given
            var type = "circle",
                radius = 0,
                geometricMath = new GeometricMath();

            // When
            circle = new Circle();

            // Then
            expect(circle.type).toEqual(type);
            expect(circle.radius).toEqual(radius);
            expect(circle.geometricMath).toEqual(geometricMath);
        });

    });

    describe('updateSize', function () {

        it('should update size property', function() {
          // Given
          var radius = 2,
              geometricMath = new GeometricMath(),
              size = geometricMath.getCircleSize(radius);

          circle = new Circle();
          circle.radius = radius;

          // When
          spyOn(circle.geometricMath, 'getCircleSize').and.callThrough();
          circle.updateSize();

          // Then
          expect(circle.geometricMath.getCircleSize).toHaveBeenCalledWith(radius);
          expect(circle.size.dx).toEqual(size.dx);
          expect(circle.size.dy).toEqual(size.dy);
        });

    });

    describe('setGeometry', function () {

        it('should set circle properties', function() {
          // Given
          var circleProperties = {
            radius : 0.2
          };

          circle = new Circle();

          // When
          spyOn(circle, 'updateSize');
          circle.setGeometry(circleProperties);

          // Then
          expect(circle.radius).toEqual(circleProperties.radius);
          expect(circle.updateSize).toHaveBeenCalledWith();
        });

    });

    describe('show', function () {

        it('should display circle on canvas', function() {
          // Given
          var center = {
                x : 0,
                y : 0
              },
              circleProperties = {
                color : "#ffa500",
                borderColor : "#ffa500",
                borderSize : 5,
                radius : 0.2
              },
              position = {
                x : 10,
                y : 5
              },
              angle = 0.5,
              canvas = document.createElement('canvas'),
              canvasCtx = canvas.getContext('2d');

          circle = new Circle();
          circle.setGeometry(circleProperties);
          center.x = position.x + circleProperties.radius;
          center.y = position.y + circleProperties.radius;

          // When
          spyOn(canvasCtx, 'translate');
          spyOn(canvasCtx, 'rotate');
          spyOn(canvasCtx, 'beginPath');
          spyOn(canvasCtx, 'arc');
          spyOn(canvasCtx, 'fill');
          spyOn(canvasCtx, 'stroke');
          circle.show(position, angle, canvas, canvasCtx);

          // Then
          expect(canvasCtx.translate).toHaveBeenCalledWith(center.x, center.y);
          expect(canvasCtx.rotate).toHaveBeenCalledWith(angle);

          expect(canvasCtx.beginPath).toHaveBeenCalled();
          expect(canvasCtx.arc).toHaveBeenCalledWith(
            position.x,
            position.y,
            circleProperties.radius,
            0,
            2 * Math.PI
          );

          expect(canvasCtx.fillStyle).toEqual(circleProperties.color);
          expect(canvasCtx.lineWidth).toEqual(circleProperties.borderSize);
          expect(canvasCtx.strokeStyle).toEqual(circleProperties.borderColor);

          expect(canvasCtx.fill).toHaveBeenCalled();
          expect(canvasCtx.stroke).toHaveBeenCalled();
          expect(canvasCtx.translate).toHaveBeenCalledWith(-center.x, -center.y);
          expect(canvasCtx.rotate).toHaveBeenCalledWith(-angle);
        });

    });

});
