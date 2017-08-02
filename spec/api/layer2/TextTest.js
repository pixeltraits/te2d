describe('Text', function () {

    var text;

    beforeEach(function () {
        text = new Text();
    });

    describe('constructor', function () {

        it('should return an object Text', function() {
            // Given
            var text;

            // When
            text = new Text();

            // Then
            expect(text.pause).toEqual(false);
            expect(text.dx).toEqual(0);
            expect(text.dy).toEqual(0);
            expect(text.text).toEqual("");
            expect(text.color).toEqual("");
            expect(text.font).toEqual("");
            expect(text.fontSize).toEqual(0);
        });

    });

    describe('updateSize when setText have been called', function () {

        it('should update dx and dy properties', function() {
            // Given
            var words = "a",
                style = {
                  color : "black",
                  font : "Arial",
                  size : 12
                },
                canvas = document.createElement('canvas'),
                canvasCtx = canvas.getContext('2d'),
                textWidth = 0;

            canvasCtx.font = style.size + "px " + style.font;
            textWidth = canvasCtx.measureText(words).width;

            // When
            text.setText(words, style);

            // Then
            expect(text.dx).toEqual(textWidth);
            expect(text.dy).toEqual(12);
        });

    });

    describe('getSize', function () {

        it('should return size of text object', function() {
            // Given
            var size;

            // When
            size = text.getSize();

            // Then
            expect(text.dx).toEqual(size.dx);
            expect(text.dy).toEqual(size.dy);
        });

    });

    describe('setPause', function () {

        it('should set pause properties to false', function() {
            // Given
            var pause = false;

            // When
            text.setPause(pause);

            // Then
            expect(text.pause).toEqual(pause);
        });

        it('should set pause properties to true', function() {
            // Given
            var pause = true;

            // When
            text.setPause(pause);

            // Then
            expect(text.pause).toEqual(pause);
        });

    });

    describe('setText', function () {

        it('should set text properties', function() {
            // Given
            var words = "Mon text",
                style = {
                  color : "#ffa500",
                  font : "Arial",
                  size : 22
                };

            // When
            spyOn(text, 'updateSize');
            text.setText(words, style);

            // Then
            expect(text.updateSize).toHaveBeenCalled();
            expect(text.text).toEqual(words);
            expect(text.color).toEqual(style.color);
            expect(text.font).toEqual(style.font);
            expect(text.fontSize).toEqual(style.size);
        });

    });

    describe('show', function () {

        it('should display text', function() {
            // Given
            var size,
                absX,
                absY,
                words = "Mon text",
                style = {
                  color : "#ffa500",
                  font : "Arial",
                  size : 22
                },
                position = {
                  x : 10,
                  y : 5
                },
                angle = 0.5,
                canvas = document.createElement('canvas'),
                canvasCtx = canvas.getContext('2d');

            text.setText(
              words,
              style
            );
            size = text.getSize();
            absX = position.x + (size.dx / 2);
            absY = position.y + (size.dy / 2);


            // When
            spyOn(canvasCtx, 'translate');
            spyOn(canvasCtx, 'rotate');
            spyOn(canvasCtx, 'fillText');
            text.show(position, angle, canvas, canvasCtx);

            // Then
            expect(canvasCtx.translate).toHaveBeenCalledWith(absX, absY);
            expect(canvasCtx.rotate).toHaveBeenCalledWith(angle);
            expect(canvasCtx.font).toEqual(style.size + "px " + style.font);
            expect(canvasCtx.fillStyle).toEqual(style.color);
            expect(canvasCtx.fillText).toHaveBeenCalledWith(words, position.x, position.y);
            expect(canvasCtx.translate).toHaveBeenCalledWith(-absX, -absY);
            expect(canvasCtx.rotate).toHaveBeenCalledWith(-angle);
        });

    });

});
