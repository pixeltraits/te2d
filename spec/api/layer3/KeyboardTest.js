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
            key : "E",
          };
          let keyInfo = {
            code : event.code,
            key : event.key,
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
            key : "E",
          };
          let keyInfo = {
            code : event.code,
            key : event.key,
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

});
