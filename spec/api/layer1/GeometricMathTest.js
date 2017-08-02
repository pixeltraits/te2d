describe('GeometricMath', function () {

    var geometricMath;

    beforeEach(function () {
        geometricMath = new GeometricMath();
    });

    describe('getPolygonSize', function () {

        it('should return size of an polygon', function() {
            // Given
            var vertices = [
                  {
                    x : 2,
                    y : 0
                  },
                  {
                    x : 10,
                    y : 10
                  },
                  {
                    x : 5,
                    y : 4
                  },
                  {
                    x : 3,
                    y : 2
                  }
                ],
                size;

            // When
            size  = geometricMath.getPolygonSize(vertices);

            // Then
            expect(size.dx).toEqual(8);
            expect(size.dy).toEqual(10);
            // ***************** Execute in console
            // var geometricMath = new GeometricMath(); geometricMath.getPolygonSize([{x:2,y:0},{x:10,y:10},{x:5,y:4},{x:3,y:2}]);
            // *****************
        });

    });

    describe('getCircleSize', function () {

        it('should return size of an circle', function() {
            // Given
            var radius = 2,
                size;

            // When
            size  = geometricMath.getCircleSize(radius);

            // Then
            expect(size.dx).toEqual(4);
            expect(size.dy).toEqual(4);
        });

    });

    describe('getRotatedPoint', function () {

        it('should return new position of point after a rotation', function() {
            // Given
            var position = {
                  x : 5,
                  y : 7
                },
                angle = 1,
                center = {
                  x : 10,
                  y : 15
                },
                rotatedPosition;

            // When
            rotatedPosition = geometricMath.getRotatedPoint(position, angle, center);

            // Then
            expect(rotatedPosition.x).toEqual(14.030256349122473);
            expect(rotatedPosition.y).toEqual(6.4702266290154);
            // ***************** Execute in console
            // var geometricMath = new GeometricMath(); geometricMath.getRotatedPoint({x:5,y:7},1,{x:10,y:15});
            // *****************
        });

    });

});
