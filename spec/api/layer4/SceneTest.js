describe('Scene', () => {

    let scene;

    beforeEach(() => {
        let size = {
          dx: 100,
          dy: 100
        };
        let ratio = 10;

        scene = new Scene(size, ratio);
    });

    describe('constructor', () => {

        it('should generate an Scene object', () => {
            // Given
            let size = {
              dx: 100,
              dy: 100
            };
            let ratio = 10;
            let cases = {
              x : Math.ceil(size.dx / ratio),
              y : Math.ceil(size.dy / ratio)
            };
            let lengthMapX = 100 / 10;
            let lengthMapY = 100 / 10;

            // When
            scene = new Scene(size, ratio);

            // Then
            expect(scene.ratio).toEqual(ratio);
            expect(scene.cases).toEqual(cases);
            expect(scene.map.length).toEqual(lengthMapX);
            expect(scene.map[0].length).toEqual(lengthMapY);
        });

    });

    describe('getEntities', () => {

        it('should return object list in the scene zone', () => {
          // Given
          let zoneSearch = {
            x: 20,
            y: 20,
            dx: 20,
            dy: 20
          };
          let zoneSonic = {
            x: 30,
            y: 30,
            dx: 40,
            dy: 40
          };
          let zoneLink = {
            x: 22,
            y: 23,
            dx: 10,
            dy: 10
          };
          let idSonic = "sonic";
          let idLink = "link";

          // When
          scene.add(zoneSonic, idSonic);
          scene.add(zoneLink, idLink);
          let entities = scene.getEntities(zoneSearch);

          // Then
          expect(entities).toEqual([idLink, idSonic]);
        });

    });

    describe('update', () => {

        it('should call delete(oldZone, id) and add(newZone, id)', () => {
          // Given
          let oldZone = {
            x: 20,
            y: 20,
            dx: 20,
            dy: 20
          };
          let newZone = {
            x: 30,
            y: 30,
            dx: 40,
            dy: 40
          };
          let idSonic = "sonic";

          // When
          spyOn(scene, 'delete');
          spyOn(scene, 'add');
          scene.update(oldZone, newZone, idSonic);

          // Then
          expect(scene.delete).toHaveBeenCalledWith(oldZone, idSonic);
          expect(scene.add).toHaveBeenCalledWith(newZone, idSonic);
        });

    });

    describe('add', () => {

        it('should add id in the zone', () => {
          // Given
          let zoneSonic = {
            x: 10,
            y: 10,
            dx: 10,
            dy: 10
          };
          let idSonic = "sonic";
          let firstCaseX = Math.floor(zoneSonic.x / 10);
          let firstCaseY = Math.floor(zoneSonic.y / 10);
          let lastCaseX = Math.ceil((zoneSonic.x + zoneSonic.dx) / 10);
          let lastCaseY = Math.ceil((zoneSonic.y + zoneSonic.dy) / 10);

          // When
          scene.add(zoneSonic, idSonic);

          // Then
          for(let x = firstCaseX; x < lastCaseX; x++) {
            for(let y = firstCaseY; y < lastCaseY; y++) {
              expect(scene.map[x][y][0]).toEqual(idSonic);
            }
          }
        });

        it('should not add id out of the zone', () => {
          // Given
          let zoneSonic = {
            x: 10,
            y: 10,
            dx: 10,
            dy: 10
          };
          let zoneOut = {
            x: 5,
            y: 5,
            dx: 4,
            dy: 4
          };
          let idSonic = "sonic";
          let firstCaseX = Math.floor(zoneOut.x / 10);
          let firstCaseY = Math.floor(zoneOut.y / 10);
          let lastCaseX = Math.ceil((zoneOut.x + zoneOut.dx) / 10);
          let lastCaseY = Math.ceil((zoneOut.y + zoneOut.dy) / 10);

          // When
          scene.add(zoneSonic, idSonic);

          // Then
          for(let x = firstCaseX; x < lastCaseX; x++) {
            for(let y = firstCaseY; y < lastCaseY; y++) {
              expect(scene.map[x][y][0]).not.toEqual(idSonic);
            }
          }
        });

    });

    describe('delete', () => {

        it('should delete id in the zone', () => {
          // Given
          let zoneSonic = {
            x: 10,
            y: 10,
            dx: 10,
            dy: 10
          };
          let idSonic = "sonic";
          let idLink = "link";
          let firstCaseX = Math.floor(zoneSonic.x / 10);
          let firstCaseY = Math.floor(zoneSonic.y / 10);
          let lastCaseX = Math.ceil((zoneSonic.x + zoneSonic.dx) / 10);
          let lastCaseY = Math.ceil((zoneSonic.y + zoneSonic.dy) / 10);

          scene.add(zoneSonic, idSonic);
          scene.add(zoneSonic, idLink);

          // When
          scene.delete(zoneSonic, idSonic);

          // Then
          for(let x = firstCaseX; x < lastCaseX; x++) {
            for(let y = firstCaseY; y < lastCaseY; y++) {
              expect(scene.map[x][y][0]).not.toEqual(idSonic);
              expect(scene.map[x][y][0]).toEqual(idLink);
            }
          }
        });

    });

});
