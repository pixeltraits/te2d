describe('Clone', function () {

    var clone;

    beforeEach(function () {
        clone = new Clone();
    });

    describe('cloneObject', function () {

        it('should return the same object that position with another reference', function() {
            // Given
            var position = {
                  x : 2,
                  y : 3
                },
                positionClone;

            // When
            positionClone  = clone.cloneObject(position);

            // Then
            expect(positionClone.x).toEqual(position.x);
            expect(positionClone.y).toEqual(position.y);
            expect(positionClone).not.toBe(position);
        });

    });

    describe('cloneComplexObject', function () {

        it('should return the same object that entity with another reference and subobject too', function() {
            // Given
            var entity = {
                  x : 2,
                  y : {
                    a : "Test",
                    b : false
                  }
                },
                entityClone;

            // When
            entityClone = clone.cloneComplexObject(entity);

            // Then
            expect(entityClone.x).toEqual(entity.x);
            expect(entityClone.y.a).toEqual(entity.y.a);
            expect(entityClone.y.b).toEqual(entity.y.b);
            expect(entityClone.y).not.toBe(entity.y);
            expect(entityClone).not.toBe(entity);
        });

        it('should return the same object that entity with same img object reference', function() {
            // Given
            var entity = {
                  z : new Image()
                },
                entityClone;

            // When
            entityClone = clone.cloneComplexObject(entity);

            // Then
            expect(entityClone.z).toEqual(entity.z);
            expect(entityClone.z).toBe(entity.z);
            expect(entityClone).not.toBe(entity);
        });

    });

});
