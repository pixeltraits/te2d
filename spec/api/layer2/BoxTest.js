describe('Box', function () {

    var box;

    beforeEach(function () {
        box = new Box();
    });

    describe('constructor', function () {

        it('should generate an Box object', function() {
            // Given
            var type = "box";

            // When
            box = new Box();

            // Then
            expect(box.type).toEqual(type);
        });

    });

    describe('setGeometry', function () {

        it('should set box properties', function() {
          // Given
          var boxProperties = {
            dx : 50,
            dy : 20
          };

          box = new Box();

          // When
          box.setGeometry(boxProperties);

          // Then
          expect(box.size.dx).toEqual(boxProperties.dx);
          expect(box.size.dy).toEqual(boxProperties.dy);
        });

    });

    describe('show', function () {

        it('should display box on canvas', function() {
          // Given
          var center = {
                x : 0,
                y : 0
              },
              boxProperties = {
                color : "#ffa500",
                borderColor : "#ffa500",
                borderSize : 5,
                dx : 10,
                dy : 20
              },
              position = {
                x : 10,
                y : 5
              },
              angle = 0.5,
              canvas = document.createElement('canvas'),
              canvasCtx = canvas.getContext('2d');

          box = new Box();
          box.setGeometry(boxProperties);
          center.x = position.x + (boxProperties.dx / 2);
          center.y = position.y + (boxProperties.dy / 2);

          // When
          spyOn(canvasCtx, 'translate');
          spyOn(canvasCtx, 'rotate');
          spyOn(canvasCtx, 'fillRect');
          box.show(position, angle, canvas, canvasCtx);

          // Then
          expect(canvasCtx.translate).toHaveBeenCalledWith(center.x, center.y);
          expect(canvasCtx.rotate).toHaveBeenCalledWith(angle);

          expect(canvasCtx.fillRect).toHaveBeenCalledWith(
            -boxProperties.dx / 2,
            -boxProperties.dy / 2,
            boxProperties.dx + (boxProperties.borderSize * 2),
            boxProperties.dy + (boxProperties.borderSize * 2)
          );

          expect(canvasCtx.fillStyle).toEqual(boxProperties.color);
          expect(canvasCtx.fillRect).toHaveBeenCalledWith(
            boxProperties.borderSize - (boxProperties.dx / 2),
            boxProperties.borderSize - (boxProperties.dy / 2),
            boxProperties.dx,
            boxProperties.dy
          );

          expect(canvasCtx.translate).toHaveBeenCalledWith(-center.x, -center.y);
          expect(canvasCtx.rotate).toHaveBeenCalledWith(-angle);
        });

    });

});
