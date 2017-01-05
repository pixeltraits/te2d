class EntitiesFactory {
    constructor() {
    }
    getInstance(className, data) {
      switch(className) {
        case "GraphicEntity" :
          return new GraphicEntity(data.properties, data.id);
          break;
        case "PhysicEntity" :
          return new PhysicEntity(data.properties, data.id);
          break;
        case "Camera" :
          return new Camera(data.properties, data.id);
          break;
        case "Player2D" :
          return new Player2D(data.properties, data.id);
          break;
      }

      return false;
    }
}
