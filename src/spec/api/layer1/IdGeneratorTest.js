import IdGenerator from '../../../api/layer1/IdGenerator.js';

describe('IdGenerator', () => {
  let idGenerator;

  beforeEach(() => {
    idGenerator = new IdGenerator();
  });

  describe('generate', () => {
    it('should return a string', () => {
      // Given
      let id = {};

      // When
      id = idGenerator.generate();

      // Then
      expect(typeof id).toBe('string');
    });
  });
});
