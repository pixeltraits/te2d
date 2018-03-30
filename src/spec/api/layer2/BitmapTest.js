import Bitmap from '../../../api/layer2/Bitmap.js';

describe('Bitmap', function () {

    var bitmap,
        animations,
        animationCallbacks;

    beforeEach(function () {
        bitmap = new Bitmap();

        var imageTestA = new Image(),
            imageTestB = new Image(),
            canvas = document.createElement('canvas'),
            canvasCtx = canvas.getContext('2d');

        canvas.width = 3;
        canvas.height = 3;

        canvasCtx.fillStyle = "#ffa500";
        canvasCtx.fillRect(
          0,
          0,
          1,
          1
        );
        canvasCtx.fillStyle = "#ffa500";
        canvasCtx.fillRect(
          2,
          0,
          1,
          1
        );
        canvasCtx.fillStyle = "#fdb600";
        canvasCtx.fillRect(
          2,
          2,
          1,
          1
        );

        imageTestA.src = canvas.toDataURL("image/png");

        animations = [
          {
            "name" : "Done",
            "bitmap" : imageTestA,
            "reverse" : false,
            "x" : 0,
            "y" : 0,
            "dx" : 3,
            "dy" : 3,
            "repeatX" : 1,
            "repeatY" : 1,
            "frames" : 0,
            "fps" : 33,
            "sens" : "h"
          },
          {
            "name" : "Yun",
            "bitmap" : imageTestB,
            "reverse" : false,
            "x" : 3,
            "y" : 3,
            "dx" : 2,
            "dy" : 2,
            "repeatX" : 1,
            "repeatY" : 1,
            "frames" : 0,
            "fps" : 33,
            "sens" : "h"
          }
        ];
        animationCallbacks = [
          function() {
            console.log("The animation Done is complete");
          },
          function() {
            console.log("The animation Yun is complete");
          }
        ];
    });

    describe('constructor', function () {

        it('should generate an Bitmap object', function() {
            // Given
            var animation = 0,
                animations = [],
                animationCallbacks = [],
                timer = new Timer(),
                pause = false,
                frame = 0;

            // When
            bitmap = new Bitmap();

            // Then
            expect(bitmap.animation).toEqual(animation);
            expect(bitmap.animations).toEqual(animations);
            expect(bitmap.animationCallbacks).toEqual(animationCallbacks);
            expect(bitmap.timer).toEqual(timer);
            expect(bitmap.pause).toEqual(pause);
            expect(bitmap.frame).toEqual(frame);
        });

    });

    describe('setAnimation', function () {

        it('should set animation properties if pause is false', function() {
            // Given
            var frame = 0,
            animation = 0;

            bitmap = new Bitmap();
            bitmap.pause = false;

            // When
            bitmap.setAnimation(animations, animationCallbacks);

            // Then
            expect(bitmap.animation).toEqual(animation);
            expect(bitmap.animations).toEqual(animations);
            expect(bitmap.animationCallbacks).toEqual(animationCallbacks);
            expect(bitmap.frame).toEqual(frame);
        });

    });

    describe('getSize', function () {

        it('should calculate size of bitmap', function() {
            // Given
            var animation = 1,
                size = {
                  dx : animations[animation].dx * animations[animation].repeatX,
                  dy : animations[animation].dy * animations[animation].repeatY
                },
                animationSize;

            bitmap.setAnimation(animations, animationCallbacks);
            bitmap.animation = 1;

            // When
            animationSize = bitmap.getSize();

            // Then
            expect(animationSize).toEqual(size);

        });

    });

    describe('setPause', function () {

        it('should set pause', function() {
            // Given
            var pause = true;

            // When
            bitmap.setPause(pause);

            // Then
            expect(bitmap.pause).toEqual(pause);

        });

    });

    describe('show', function () {

        it('should display bitmap on canvas with no repeat AND no reverse image', function() {
          // Given
          var position = {
                x : 10,
                y : 5
              },
              repeat = {
                x : 1,
                y : 1
              },
              angle = 0.5,
              canvas = document.createElement('canvas'),
              canvasCtx = canvas.getContext('2d'),
              canvasSize = {
                dx : 50,
                dy : 50
              },
              x = 0;

          animations[0].repeatX = 1;
          animations[0].repeatY = 1;

          bitmap = new Bitmap();
          bitmap.setAnimation(animations);

          // When
          spyOn(bitmap, 'updateAnimationFrame');
          spyOn(canvasCtx, 'translate');
          spyOn(canvasCtx, 'rotate');
          spyOn(canvasCtx, 'drawImage');
          spyOn(bitmap, 'cutBitmap').and.callThrough();
          spyOn(bitmap, 'getRepBitmap').and.callThrough();

          bitmap.show(position, angle, canvasSize, canvasCtx);

          // Then
          expect(bitmap.updateAnimationFrame).toHaveBeenCalled();
          expect(bitmap.getRepBitmap.calls.any()).toEqual(false);

          for(; x < repeat.x; x++) {
            for(var y = 0; y < repeat.y; y++) {
              var img = bitmap.cutBitmap(
                    {
                      x : position.x + (bitmap.animations[bitmap.animation].dx * x),
                      y : position.y + (bitmap.animations[bitmap.animation].dy * y)
                    },
                    canvasSize
                  ),
                  centerX = img.x + (img.dx / 2),
                  centerY = img.y + (img.dy / 2);

              expect(canvasCtx.translate).toHaveBeenCalledWith(centerX, centerY);
              expect(canvasCtx.rotate).toHaveBeenCalledWith(angle);

              expect(canvasCtx.drawImage).toHaveBeenCalledWith(
                bitmap.animations[bitmap.animation].bitmap,
                img.ix,
                img.iy,
                img.dx,
                img.dy,
                -img.dx / 2,
                -img.dy / 2,
                img.dx,
                img.dy
              );

              expect(canvasCtx.rotate).toHaveBeenCalledWith(-angle);
              expect(canvasCtx.translate).toHaveBeenCalledWith(-centerX, -centerY);
            }
          }
        });

        it('should display bitmap on canvas with repeat AND no reverse image', function() {
          // Given
          var position = {
                x : 10,
                y : 5
              },
              repeat = {
                x : 1,
                y : 1
              },
              angle = 0.5,
              canvas = document.createElement('canvas'),
              canvasCtx = canvas.getContext('2d'),
              canvasSize = {
                dx : 50,
                dy : 50
              },
              x = 0;

          animations[0].repeatX = 2;
          animations[0].repeatY = 2;

          bitmap = new Bitmap();
          bitmap.setAnimation(animations);

          if(bitmap.animations[bitmap.animation].repeatX > 1 || bitmap.animations[bitmap.animation].repeatY > 1) {
            repeat = bitmap.getRepBitmap(position, canvasSize);
          }

          // When
          spyOn(bitmap, 'updateAnimationFrame');
          spyOn(canvasCtx, 'translate');
          spyOn(canvasCtx, 'rotate');
          spyOn(canvasCtx, 'drawImage');
          spyOn(bitmap, 'cutBitmap').and.callThrough();
          spyOn(bitmap, 'getRepBitmap').and.callThrough();

          bitmap.show(position, angle, canvasSize, canvasCtx);

          // Then
          expect(bitmap.updateAnimationFrame).toHaveBeenCalled();
          expect(bitmap.getRepBitmap).toHaveBeenCalledWith(position, canvasSize);

          for(; x < repeat.x; x++) {
            for(var y = 0; y < repeat.y; y++) {
              var img = bitmap.cutBitmap(
                    {
                      x : position.x + (bitmap.animations[bitmap.animation].dx * x),
                      y : position.y + (bitmap.animations[bitmap.animation].dy * y)
                    },
                    canvasSize
                  ),
                  centerX = img.x + (img.dx / 2),
                  centerY = img.y + (img.dy / 2);

              expect(canvasCtx.translate).toHaveBeenCalledWith(centerX, centerY);
              expect(canvasCtx.rotate).toHaveBeenCalledWith(angle);

              expect(canvasCtx.drawImage).toHaveBeenCalledWith(
                bitmap.animations[bitmap.animation].bitmap,
                img.ix,
                img.iy,
                img.dx,
                img.dy,
                -img.dx / 2,
                -img.dy / 2,
                img.dx,
                img.dy
              );

              expect(canvasCtx.rotate).toHaveBeenCalledWith(-angle);
              expect(canvasCtx.translate).toHaveBeenCalledWith(-centerX, -centerY);
            }
          }
        });

        it('should display bitmap on canvas with no repeat AND reverse image', function() {
          // Given
          var position = {
                x : 10,
                y : 5
              },
              repeat = {
                x : 1,
                y : 1
              },
              angle = 0.5,
              canvas = document.createElement('canvas'),
              canvasCtx = canvas.getContext('2d'),
              canvasSize = {
                dx : 50,
                dy : 50
              },
              x = 0;

          animations[0].repeatX = 1;
          animations[0].repeatY = 1;
          animations[0].reverse = true;

          bitmap = new Bitmap();
          bitmap.setAnimation(animations);

          // When
          spyOn(bitmap, 'updateAnimationFrame');
          spyOn(canvasCtx, 'translate');
          spyOn(canvasCtx, 'rotate');
          spyOn(canvasCtx, 'drawImage');
          spyOn(bitmap, 'cutBitmap').and.callThrough();
          spyOn(bitmap, 'flipBitmap').and.callThrough();

          bitmap.show(position, angle, canvasSize, canvasCtx);

          // Then
          expect(bitmap.updateAnimationFrame).toHaveBeenCalled();

          for(; x < repeat.x; x++) {
            for(var y = 0; y < repeat.y; y++) {
              var img = bitmap.cutBitmap(
                    {
                      x : position.x + (bitmap.animations[bitmap.animation].dx * x),
                      y : position.y + (bitmap.animations[bitmap.animation].dy * y)
                    },
                    canvasSize
                  ),
                  centerX = img.x + (img.dx / 2),
                  centerY = img.y + (img.dy / 2);

              expect(canvasCtx.translate).toHaveBeenCalledWith(centerX, centerY);
              expect(canvasCtx.rotate).toHaveBeenCalledWith(angle);

              img.bitmap = bitmap.animations[bitmap.animation].bitmap;
              expect(canvasCtx.drawImage).toHaveBeenCalledWith(
                bitmap.flipBitmap(img),
                0,
                0,
                img.dx,
                img.dy,
                -img.dx / 2,
                -img.dy / 2,
                img.dx,
                img.dy
              );
              expect(bitmap.flipBitmap).toHaveBeenCalledWith(img);

              expect(canvasCtx.rotate).toHaveBeenCalledWith(-angle);
              expect(canvasCtx.translate).toHaveBeenCalledWith(-centerX, -centerY);
            }
          }
        });

    });

    describe('flipBitmap', function () {

        var reverseImage,
            animation;

        beforeEach(function(){
          var canvas = document.createElement('canvas'),
              canvasCtx = canvas.getContext('2d');

          canvas.width = 3;
          canvas.height = 3;

          canvasCtx.fillStyle = "#ffa500";
          canvasCtx.fillRect(
            2,
            0,
            1,
            1
          );
          canvasCtx.fillStyle = "#ffa500";
          canvasCtx.fillRect(
            0,
            0,
            1,
            1
          );
          canvasCtx.fillStyle = "#fdb600";
          canvasCtx.fillRect(
            0,
            2,
            1,
            1
          );

          reverseImage = canvasCtx.getImageData(0, 0, 3, 3);

          animation = {
            bitmap : animations[0].bitmap,
            ix : 0,
            iy : 0,
            dx : 3,
            dy : 3
          };
        });

        it('should reverse image', function() {
          // Given
          var reversedImage,
              canvas = document.createElement('canvas'),
              canvasCtx = canvas.getContext('2d');

          canvas.width = 3;
          canvas.height = 3;

          // When
          reversedImage = bitmap.flipBitmap(animation);
          canvasCtx.drawImage(
            reversedImage,
            0,
            0,
            3,
            3,
            0,
            0,
            3,
            3
          );

          reversedImage = canvasCtx.getImageData(0, 0, 3, 3);

          // Then
          expect(reversedImage.width).toEqual(reverseImage.width);
          expect(reversedImage.height).toEqual(reverseImage.height);
          expect(reversedImage.data).toEqual(reverseImage.data);
        });
    });

});
