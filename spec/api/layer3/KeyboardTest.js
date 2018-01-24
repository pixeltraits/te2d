describe('Keyboard', () => {

    let keyboard;

    beforeEach(() => {
        let domELement = window;
        let onKeydown = () => {};
        let onKeyup = () => {};
        let active = false;
        let activeKey = [];

        keyboard = new Keyboard(domELement, onKeydown, onKeyup);
    });

    describe('constructor', () => {

        it('should generate an Keyboard object', () => {
            // Given
            let domELement = window;
            let onKeydown = () => {};
            let onKeyup = () => {};
            let active = false;
            let activeKey = [];

            // When
            spyOn(Keyboard.prototype, 'addEvents').and.callThrough();
            keyboard = new Keyboard(domELement, onKeydown, onKeyup);

            // Then
            expect(keyboard.domELement).toEqual(domELement);
            expect(keyboard.onKeydown).toEqual(onKeydown);
            expect(keyboard.onKeyup).toEqual(onKeyup);
            expect(keyboard.active).toBeTruthy();
            expect(keyboard.activeKey).toEqual(activeKey);
            expect(Keyboard.prototype.addEvents).toHaveBeenCalled();
        });

    });

    describe('handleEvent', () => {

        it('should call this.keydown(event) if event.type is keydown', () => {
          // Given
          let event = {
            type : "keydown"
          };

          // When
          spyOn(keyboard, 'keydown');
          keyboard.handleEvent(event);

          // Then
          expect(keyboard.keydown).toHaveBeenCalledWith(event);
        });

        it('should call this.blur(event) if event.type is blur', () => {
          // Given
          let event = {
            type : "blur"
          };

          // When
          spyOn(keyboard, 'blur');
          keyboard.handleEvent(event);

          // Then
          expect(keyboard.blur).toHaveBeenCalled();
        });

        it('should call this.keyup(event) if event.type is keyup', () => {
          // Given
          let event = {
            type : "keyup"
          };

          // When
          spyOn(keyboard, 'keyup');
          keyboard.handleEvent(event);

          // Then
          expect(keyboard.keyup).toHaveBeenCalledWith(event);
        });

    });

    describe('keydown', () => {

        it('should call this.addKey(keyInfo) and this.onKeydown(keyInfo) if this.isActive(keyInfo) return false', () => {
          // Given
          let event = {
            code : 10,
            key : "E"
          };
          let keyInfo = {
            code : event.code,
            key : event.key
          };

          // When
          spyOn(keyboard, 'addKey');
          spyOn(keyboard, 'onKeydown');
          keyboard.keydown(event);

          // Then
          expect(keyboard.addKey).toHaveBeenCalledWith(keyInfo);
          expect(keyboard.onKeydown).toHaveBeenCalledWith(keyInfo);
        });

    });

    describe('keyup', () => {

        it('should call this.deleteKey(keyInfo) and this.onKeyup(keyInfo)', () => {
          // Given
          let event = {
            code : 10,
            key : "E"
          };
          let keyInfo = {
            code : event.code,
            key : event.key
          };

          // When
          spyOn(keyboard, 'deleteKey');
          spyOn(keyboard, 'onKeyup');
          keyboard.keyup(event);

          // Then
          expect(keyboard.deleteKey).toHaveBeenCalledWith(keyInfo);
          expect(keyboard.onKeyup).toHaveBeenCalledWith(keyInfo);
        });

    });

    describe('addEvents', () => {

        it('should set keyboard events if they are not active', () => {
          // Given
          let active = false;

          // When
          spyOn(keyboard.domELement, 'addEventListener');
          keyboard.active = active;
          keyboard.addEvents();

          // Then
          expect(keyboard.domELement.addEventListener).toHaveBeenCalledWith('keydown', keyboard, false);
          expect(keyboard.domELement.addEventListener).toHaveBeenCalledWith('keyup', keyboard, false);
          expect(keyboard.domELement.addEventListener).toHaveBeenCalledWith('blur', keyboard, false);
          expect(keyboard.active).toBeTruthy();
        });

    });

    describe('deleteEvents', () => {

        it('should unset keyboard events if they are active', () => {
          // Given
          let active = false;

          // When
          spyOn(keyboard.domELement, 'removeEventListener');
          keyboard.active = active;
          keyboard.deleteEvents();

          // Then
          expect(keyboard.domELement.removeEventListener).toHaveBeenCalledWith('keydown', keyboard, false);
          expect(keyboard.domELement.removeEventListener).toHaveBeenCalledWith('keyup', keyboard, false);
          expect(keyboard.domELement.removeEventListener).toHaveBeenCalledWith('blur', keyboard, false);
          expect(keyboard.active).toBeFalsy();
        });

    });

    describe('deleteAllKeys', () => {

        it('should clear activeKey array', () => {
          // Given
          let activeKey = [];

          // When
          keyboard.deleteAllKeys();

          // Then
          expect(keyboard.activeKey).toEqual(activeKey);
        });

    });

    describe('isActive', () => {

        it('should return true if keyinfo.code is in activeKey array', () => {
          // Given
          let activeKey = [
            {
              code : 10,
              key : "E"
            },
            {
              code : 11,
              key : "R"
            }
          ];

          keyboard.activeKey = activeKey;

          // When
          const isActive = keyboard.isActive({
            code : 10,
            key : "E"
          });

          // Then
          expect(isActive).toBeTruthy();
        });

        it('should return false if keyinfo.code is not in activeKey array', () => {
          // Given
          let activeKey = [
            {
              code : 10,
              key : "E"
            },
            {
              code : 11,
              key : "R"
            }
          ];

          keyboard.activeKey = activeKey;

          // When
          const isActive = keyboard.isActive({
            code : 13,
            key : "E"
          });

          // Then
          expect(isActive).toBeFalsy();
        });

    });

    describe('deleteKey', () => {

        it('should remove keyinfo from activeKey array', () => {
          // Given
          let activeKey = [
            {
              code : 10,
              key : "E"
            },
            {
              code : 11,
              key : "R"
            }
          ];

          keyboard.activeKey = activeKey;

          // When
          keyboard.deleteKey({
            code : 11,
            key : "R"
          });

          // Then
          expect(keyboard.activeKey).not.toEqual([
            {
              code : 10,
              key : "E"
            },
            {
              code : 11,
              key : "R"
            }
          ]);
        });

    });

    describe('addKey', () => {

        it('should add keyinfo to activeKey array', () => {
          // Given
          let activeKey = [
            {
              code : 10,
              key : "E"
            }
          ];

          keyboard.activeKey = activeKey;

          // When
          keyboard.addKey({
            code : 11,
            key : "R"
          });

          // Then
          expect(keyboard.activeKey[keyboard.activeKey.length - 1]).toEqual(
            {
              code : 11,
              key : "R"
            }
          );
        });

    });

    describe('blur', () => {

        it('should onKeyup for all key allready onKeydown and call deleteAllKeys', () => {
          // Given
          let activeKey = [
            {
              code : 10,
              key : "E"
            },
            {
              code : 11,
              key : "R"
            }
          ];
          let lengthActiveKey = activeKey.length;

          keyboard.activeKey = [
            {
              code : 10,
              key : "E"
            },
            {
              code : 11,
              key : "R"
            }
          ];

          // When
          spyOn(keyboard, 'onKeyup');
          spyOn(keyboard, 'deleteAllKeys');
          keyboard.blur();

          // Then
          for(let x = 0; x < lengthActiveKey; x++) {
            expect(keyboard.onKeyup).toHaveBeenCalledWith(activeKey[x]);
          }
          expect(keyboard.deleteAllKeys).toHaveBeenCalled();
        });

    });

});
