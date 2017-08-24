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
          center.x = position.x + (box.size.dx / 2);
          center.y = position.y + (box.size.dy / 2);

          // When
          spyOn(canvasCtx, 'translate');
          spyOn(canvasCtx, 'rotate');
          spyOn(canvasCtx, 'fillRect');
          box.show(position, angle, canvas, canvasCtx);

          // Then
          expect(canvasCtx.translate).toHaveBeenCalledWith(center.x, center.y);
          expect(canvasCtx.rotate).toHaveBeenCalledWith(angle);

          expect(canvasCtx.fillRect).toHaveBeenCalledWith(
            -box.size.dx / 2,
            -box.size.dy / 2,
            box.size.dx + (box.borderSize * 2),
            box.size.dy + (box.borderSize * 2)
          );

          expect(canvasCtx.fillStyle).toEqual(box.color);
          expect(canvasCtx.fillRect).toHaveBeenCalledWith(
            box.borderSize - (box.size.dx / 2),
            box.borderSize - (box.size.dy / 2),
            box.size.dx,
            box.size.dy
          );

          expect(canvasCtx.translate).toHaveBeenCalledWith(-center.x, -center.y);
          expect(canvasCtx.rotate).toHaveBeenCalledWith(-angle);
        });

    });

});
