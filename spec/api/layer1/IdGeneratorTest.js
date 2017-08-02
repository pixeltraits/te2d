describe('IdGenerator', function () {

    var idGenerator;

    beforeEach(function () {
        idGenerator = new IdGenerator();
    });

    describe('generate', function () {

        it('should return a string', function() {
            // Given
            var id;

            // When
            id  = idGenerator.generate();

            // Then
            expect(typeof(id)).toBe("string");
        });

    });

});
