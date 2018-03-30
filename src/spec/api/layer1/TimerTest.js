import Timer from '../../../api/layer1/Timer.js';

describe('Timer', () => {

    let timer;

    beforeEach(function () {
        let delta = 10;
        timer = new Timer(delta);
    });

    describe('constructor', function () {

        it('should initialize timer', function() {
            // Given
            var delta = 10,
                timer;

            // When
            timer = new Timer(delta);

            // Then
            expect(timer.t1).toEqual(0);
            expect(timer.t2).toEqual(0);
            expect(timer.delta).toEqual(10);
        });

    });

    describe('setDelta', function () {

        it('should set delta to x', function() {
            // Given
            var x = 20;

            // When
            timer.setDelta(x);

            // Then
            expect(timer.delta).toEqual(20);
        });

    });

    describe('whatTimeIsIt', function () {

        it('should return true if timer.t1 equal 0', function() {
            // Given
            timer.t1 = 0;

            // Then
            expect(timer.whatTimeIsIt()).toBeTruthy();
        });

        it('should return true if time delta is past', function() {
            // Given
            timer.setDelta(10);
            timer.t1 = Date.now() - 10;

            // Then
            expect(timer.whatTimeIsIt()).toBeTruthy();
        });

        it('should return false if time delta is not past', function() {
            // Given
            timer.setDelta(10);
            timer.t1 = Date.now() - 5;

            // Then
            expect(timer.whatTimeIsIt()).toBeFalsy();
        });

        it('should set timer.t1 to actual date if time delta is not past', function() {
            // Given
            timer.setDelta(10);
            timer.t1 = Date.now() - 10;

            // When
            timer.whatTimeIsIt();

            // Then
            expect(timer.t1).toBeCloseTo(Date.now(), 12);
        });

        it('should set timer.t1 to actual date if time.t1 equal 0', function() {
            // Given
            timer.t1 = 0;

            // When
            timer.whatTimeIsIt();

            // Then
            expect(timer.t1).toBeCloseTo(Date.now(), 12);
        });

    });

});
