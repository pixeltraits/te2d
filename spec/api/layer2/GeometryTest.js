describe('Geometry', function () {

    var geometry;

    beforeEach(function () {
        geometry = new Geometry();
    });

    describe('constructor', function () {

        it('should generate an Geometry object', function() {
            // Given
            var type = "",
                pause = false,
                color = "",
                borderColor = "",
                borderSize = 0,
                size = {
                  dx : 0,
                  dy : 0
                };

            // When
            geometry = new Geometry();

            // Then
            expect(geometry.type).toEqual(type);
            expect(geometry.pause).toEqual(pause);
            expect(geometry.color).toEqual(color);
            expect(geometry.borderColor).toEqual(borderColor);
            expect(geometry.borderSize).toEqual(borderSize);
            expect(geometry.size.dx).toEqual(size.dx);
            expect(geometry.size.dy).toEqual(size.dy);
        });

    });

    describe('getSize', function () {

        it('should return size property', function() {
          // Given
          var size = {
                dx : 50,
                dy : 0
              },
              geometrySize;

          geometry = new Geometry();
          geometry.size.dx = size.dx;
          geometry.size.dy = size.dy;

          // When
          geometrySize = geometry.getSize();

          // Then
          expect(geometrySize.dx).toEqual(size.dx);
          expect(geometrySize.dy).toEqual(size.dy);
        });

    });

    describe('setGeometry', function () {

        it('should set geometry properties', function() {
          // Given
          var geometryProperties = {
            color : "orange",
            borderColor : "blue",
            borderSize : 0
          };

          geometry = new Geometry();

          // When
          geometry.setGeometry(geometryProperties);

          // Then
          expect(geometry.color).toEqual(geometryProperties.color);
          expect(geometry.borderColor).toEqual(geometryProperties.borderColor);
          expect(geometry.borderSize).toEqual(geometryProperties.borderSize);
        });

    });

    describe('setPause', function () {

        it('should set pause', function() {
          // Given
          var pause = true;

          geometry = new Geometry();

          // When
          geometry.setPause(pause);

          // Then
          expect(geometry.pause).toEqual(pause);
        });

    });

});
