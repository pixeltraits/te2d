import PhysicInterface from './api/layer3/PhysicInterface.js';
import Camera from './api/layer5/Camera.js';
import LoadUtils from './config/layer1/LoadUtils.js';
import Loader from './config/layer1/Loader.js';
import Keyboard from './api/layer3/Keyboard.js';
import Scene from './api/layer4/Scene.js';
import EntitiesFactory from './config/layer1/EntitiesFactory.js';
import Clone from './api/layer1/Clone.js';
import IdGenerator from './api/layer1/IdGenerator.js';

/**
 * Load contents configuration
 * @class Game
 */
export default class Game {
  /**
   * Load contents configuration
   * @method Game
   * @param {string} configUrl - Config url
   * @param {string} gameConfigUrl - Game config url
   * @param {function} onLoad - Function callback onload
   * @return {void}
   */
  constructor(configUrl, gameConfigUrl, onLoad) {
    const self = this;
    this.configUrl = configUrl;
    this.lang = 'fr';
    this.widthGame = 800;
    this.heightGame = 600;
    this.fullscreen = false;
    this.canvasId = '';
    this.loaderConfig = 'loader.json';

    // Game Ressources for one Level
    this.bitmaps = [];
    this.audios = [];
    this.audioContext = new window.AudioContext();
    this.entities = [];
    this.entityGroups = {};
    this.texts = [];
    this.controlers = [];
    this.controlers.keyboard = [];
    this.controlers.mouse = [];
    this.scene = [];

    // Game Ressources configuration for one Level
    this.animations = [];
    this.audioProfils = [];
    this.entityProfils = [];
    this.keyboardProfils = [];
    this.mouseProfiles = [];
    this.textProfils = [];
    this.physicProfils = [];

    // Physic Engine(Interface)
    this.physicInterface = {};
    this.game = this;

    // Load game config file
    LoadUtils.jsonLoader({
      url: this.configUrl + gameConfigUrl,
      onLoad: (gameConfig, reference) => {
        self.lang = gameConfig.lang !== 'undefined' ? gameConfig.lang : self.lang;
        self.widthGame = gameConfig.widthGame !== 'undefined' ? gameConfig.widthGame : self.widthGame;
        self.heightGame = gameConfig.heightGame !== 'undefined' ? gameConfig.heightGame : self.heightGame;
        self.displayMode = gameConfig.displayMode !== 'undefined' ? gameConfig.displayMode : self.displayMode;
        self.canvasId = gameConfig.canvasId;

        self.camera = new Camera(
          {
            name: gameConfig.cameraName,
            scale: 1,
            canvasId: self.canvasId,
            displayMode: self.displayMode,
            dx: self.widthGame,
            dy: self.heightGame
          },
          'default'
        );

        LoadUtils.jsonLoader({
          url: self.configUrl + gameConfig.loaderConfig,
          onLoad: (bitmapConfig, reference) => {
            LoadUtils.bitmapLoader({
              url: self.configUrl + bitmapConfig.bitmapUrl,
              onLoad: (bitmap, reference) => {
                const cameraSize = self.camera.getSize();
                self.loader = new Loader(
                  bitmap,
                  bitmapConfig,
                  {
                    dx: cameraSize.dx,
                    dy: cameraSize.dy,
                    context: self.camera.ctx
                  },
                  () => {}
                );
                onLoad();
              }
            });
          }
        });
      }
    });
  }
  /**
     * Load contents configuration
     * @method loadLevel
     * @param {string} name - name
     * @param {function} onLoad - onLoad
     * @return {void}
     */
  loadLevel(name, onLoad) {
    const self = this;
    this.loader.setOnCompleteMethod(onLoad);

    LoadUtils.jsonLoader({
      url: `${self.configUrl}/levels/${name}.json`,
      onLoad: (levelConfig, reference) => {
        this.level = levelConfig.levelInfo;
        this.entityGroups = levelConfig.entityGroups;
        this.startProperties = {
          startActions: levelConfig.startActions,
          startObjects: levelConfig.entities
        };

        // Load Texts
        LoadUtils.loadContent(
          `${self.configUrl}resources/texts/${self.lang}/`,
          levelConfig.texts,
          {
            type: 'jsonLoader',
            context: null
          },
          (texts) => {// When all contents are loaded
            self.texts = texts;
            self.loader.addPourcentLoaded(10);
          },
          (text) => {// When One contents is loaded
            self.loader.upTextInfo(`Le text ${text.name} a été chargé.`);
          }
        );
        // Load Collisions
        LoadUtils.loadContent(
          `${self.configUrl}resources/physicProfils/`,
          levelConfig.physicProfils,
          {
            type: 'jsonLoader',
            context: null
          },
          (physicProfils) => {// When all contents are loaded
            self.physicProfils = physicProfils;
            self.loader.addPourcentLoaded(10);
          },
          (physicProfil) => {// When One contents is loaded
            self.loader.upTextInfo(`Les collisions ${physicProfil.name} ont été chargées.`);
          }
        );
        // Load textProfils
        LoadUtils.loadContent(
          `${self.configUrl}resources/textProfils/`,
          levelConfig.textProfils,
          {
            type: 'jsonLoader',
            context: null
          },
          (textProfils) => {// When all contents are loaded
            self.textProfils = textProfils;
            self.loader.addPourcentLoaded(10);
          },
          (textProfil) => {// When One contents is loaded
            self.loader.upTextInfo(`Le design de text ${textProfil.name} a été chargé.`);
          }
        );
        // Load bitmaps and theirs configurations
        LoadUtils.loadContent(
          `${self.configUrl}resources/bitmaps/`,
          levelConfig.bitmaps,
          {
            type: 'bitmapLoader',
            context: null
          },
          (bitmaps) => {// When all contents are loaded
            self.bitmaps = bitmaps;
            // load Configurations
            LoadUtils.loadContent(
              `${self.configUrl}resources/animations/`,
              levelConfig.animations,
              {
                type: 'jsonLoader',
                context: null
              },
              (animations) => {// When all contents are loaded
                // Load animations group
                LoadUtils.loadContent(
                  `${self.configUrl}resources/animations/`,
                  levelConfig.animationsGroups,
                  {
                    type: 'jsonLoader',
                    context: null
                  },
                  (animationsGroups) => {// When all contents are loaded
                    self.loader.addPourcentLoaded(10);
                  },
                  (animationsGroup) => {// When One content is loaded
                    const tab = [];
                    const length = animationsGroup.length;

                    for (let x = 0; x < length; x++) {
                      tab[x] = self.animations[animationsGroup[x]][0];
                    }
                    self.animations[animationsGroup.name] = tab;
                    self.loader.upTextInfo(`Le groupe d'animation ${animationsGroup.name} a été chargé.`);
                  }
                );
                self.loader.addPourcentLoaded(10);
              },
              (animation) => {// When One content is loaded
                animation.bitmap = self.bitmaps[animation.bitmap];
                self.animations[animation.name] = [animation];
                self.loader.upTextInfo(`L'animation ${animation.name} a bien été chargé.`);
              }
            );
            self.loader.addPourcentLoaded(10);
          },
          (bitmap) => {// When One content is loaded
            self.loader.upTextInfo(`L'image ${bitmap.name} a été chargé.`);
          }
        );

        // Load audio files and theirs configurations
        LoadUtils.loadContent(
          `${self.configUrl}resources/audios/`,
          levelConfig.audios,
          {
            type: 'audioLoader',
            context: self.audioContext
          },
          (audios) => {// When all contents are loaded
            self.audios = audios;
            // load profils
            LoadUtils.loadContent(
              `${self.configUrl}resources/audioProfils/`,
              levelConfig.audioProfils,
              {
                type: 'jsonLoader',
                context: null
              },
              (audioProfils) => {// When all contents are loaded
                self.audioProfils = audioProfils;
                self.loader.addPourcentLoaded(10);
              },
              (audioProfil) => {// When One content is loaded
                audioProfil.audio = self.audios[audioProfil.audio];
                self.loader.upTextInfo(`La configuration du fichier audio ${audioProfil.name} a été chargé.`);
              }
            );
            self.loader.addPourcentLoaded(10);
          },
          (audio) => {// When One content is loaded
            self.loader.upTextInfo(`Le fichier audio ${audio.name} a été chargé.`);
          }
        );

        // Load objects of scene
        LoadUtils.loadContent(
          `${self.configUrl}resources/entityProfils/`,
          levelConfig.entityProfils,
          {
            type: 'jsonLoader',
            context: null
          },
          (entityProfils) => {// When all contents are loaded
            self.entityProfils = entityProfils;
            // Generation des objets
            const length = levelConfig.entities.length;
            for (let x = 0; x < length; x++) {
              self.createSceneObject(
                self.entityProfils[levelConfig.entities[x].objectConf],
                levelConfig.entities[x].id
              );
            }

            self.loader.addPourcentLoaded(10);
          },
          (entityProfil) => {// When One content is loaded
            self.loader.upTextInfo(`La configuration de l'objet ${entityProfil.name} a été chargé.`);
          }
        );

        // Load Command systeme
        if (navigator.userAgent.match(/(android|iphone|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
        } else {
          // Mouse -- 1.0
          // Keyboard
          LoadUtils.loadContent(
            `${self.configUrl}resources/controlerProfils/keyboards/`,
            levelConfig.keyboard,
            {
              type: 'jsonLoader',
              context: null
            },
            (players) => {// When all contents are loaded
              self.loader.addPourcentLoaded(10);
            },
            (player) => {// When One content is loaded
              self.controlers['keyboard'][player.config.player] = new Keyboard(
                window,
                (keyInfo) => {// keydown
                  if (typeof player.keys[keyInfo.code] !== 'undefined') {
                    const length = player.keys[keyInfo.code].down.length;

                    for (let x = 0; x < length; x++) {
                      self.setAction(player.keys[keyInfo.code].down[x], '', '');
                    }
                  }
                },
                (keyInfo) => {// keyup
                  if (typeof player.keys[keyInfo.code] !== 'undefined') {
                    const length = player.keys[keyInfo.code].up.length;

                    for (let x = 0; x < length; x++) {
                      self.setAction(player.keys[keyInfo.code].up[x], '', '');
                    }
                  }
                }
              );
              self.loader.upTextInfo(`Les commandes de ${player.name} a été chargé.`);
            }
          );
        }

        // Creation of the graphic scene
        self.scene.graphic = new Scene(
          {
            dx: self.level.widthScene,
            dy: self.level.heightScene
          },
          self.level.ratioScene
        );
        // Creation of the physic scene
        self.scene.physic = new Scene(
          {
            dx: self.level.widthScene,
            dy: self.level.heightScene
          },
          self.level.ratioScene
        );
      }
    });
  }
  /**
   * Start the loaded level
   * @method startLevel
   * @return {void}
   */
  startLevel() {
    const self = this;

    this.physicInterface = new PhysicInterface(
      (contact) => {
        this.collisionStart(contact);
      },
      (contact) => {
        this.collisionEnd(contact);
      },
      this.level.gravity,
      this.level.pixelFactor
    );

    this.entities[this.level.cameraId].setDisplayUpdateMethod((framerate) => {
      const cameraSize = self.entities[self.level.cameraId].getSize();
      const inView = self.scene.graphic.getEntities({
        x: self.entities[self.level.cameraId].position.x,
        y: self.entities[self.level.cameraId].position.y,
        dx: cameraSize.dx,
        dy: cameraSize.dy
      });
      const inPhysic = self.scene.physic.getEntities({
        x: self.entities[self.level.cameraId].position.x,
        y: self.entities[self.level.cameraId].position.y,
        dx: cameraSize.dx,
        dy: cameraSize.dy
      });
      let length = inView.length;

      // Increase sort of the objects by z propertie
      inView.sort((a, b) => {
        const entityPositionA = self.entities[a].getPosition();
        const entityPositionB = self.entities[b].getPosition();
        return (entityPositionA.z > entityPositionB.z) ? 1 : -1;
      });


      // Update of display------------------------------------
      // Clear display
      self.entities[self.level.cameraId].ctx.clearRect(
        0,
        0,
        cameraSize.dx + cameraSize.dx,
        cameraSize.dy + cameraSize.dy
      );

      // Call of entities graphic system
      for (let x = 0; x < length; x++) {
        self.entities[inView[x]].updateGraphicObject(
          self.entities[self.level.cameraId].ctx,
          {
            dx: cameraSize.dx,
            dy: cameraSize.dy
          },
          {
            x: self.entities[self.level.cameraId].position.x,
            y: self.entities[self.level.cameraId].position.y
          }
        );
      }
      length = inPhysic.length;

      // Call of entities graphic system
      for (let x = 0; x < length; x++) {
        self.entities[inPhysic[x]].updatePhysicPosition();
      }

      self.physicInterface.updateEngine(framerate, 6, 2);
    });

    // Camera configuration for the level
    this.entities[this.level.cameraId].setPosition({
      x: this.level.xCam,
      y: this.level.yCam
    });
    this.entities[this.level.cameraId].setDisplaySize({
      dx: this.level.widthCam,
      dy: this.level.heightCam
    });
    this.entities[this.level.cameraId].activeFullwindow();

    const lengthX = this.startProperties.startObjects.length;
    const lengthY = this.startProperties.startActions.length;

    for (let x = 0; x < lengthX; x++) {
      this.setObjectOfSceneConfig(
        this.entityProfils[this.startProperties.startObjects[x].objectConf].config,
        this.startProperties.startObjects[x].id
      );
    }

    for (let y = 0; y < lengthY; y++) {
      this.setAction(this.startProperties.startActions[y], '', '');
    }

    this.entities[this.level.cameraId].start();
  }
  /**
   * Destroy level
   * @method destroyLevel
   * @return {void}
   */
  destroyLevel() {
    this.camera.stop();
  }
  /**
   * Set action
   * @method setAction
   * @param {action} actionConfiguration - actionConfiguration
   * @param {object} self - self
   * @param {object} him - him
   * @return {void}
   */
  setAction(actionConfiguration, self, him) {
    const action = Clone.cloneDataObject(actionConfiguration);
    let objectReference;
    const resource = {};
    let id;
    let length = 0;

    try {
      switch (action.type) {
        case 'action':
          if (action.id !== false) {
            switch (action.id) {
              case 'self':
                action.id = self;
                break;
              case 'him':
                action.id = him;
                break;
              default:
                break;
            }
            objectReference = this[action.context][action.id];
          } else {
            objectReference = this[action.context];
          }
          return objectReference[action.method](this.setAction(action.argument, self, him));
          break;
        case 'simple':
          return action.argument;
          break;
        case 'resource':
          if (action.id !== false) {
            switch (action.id) {
              case 'self':
                action.id = self;
                break;
              case 'him':
                action.id = him;
                break;
              default:
                break;
            }
            return this[action.context][action.id];
          }

          return this[action.context];
          break;
        case 'object':
          length = action.properties.length;

          for (let x = 0; x < length; x++) {
            resource[action.properties[x].name] = this.setAction(action.properties[x].content, self, him);
          }

          return resource;
          break;
        case 'newObject':
          if (action.context !== false) {
            if (action.id !== false) {
              switch (action.id) {
                case 'self':
                  action.id = self;
                  break;
                case 'him':
                  action.id = him;
                  break;
                default:
                  break;
              }
              objectReference = this[action.context][action.id];
            } else {
              objectReference = this[action.context];
            }
            id = this.createSceneObject(objectReference, 'auto');
            this.setObjectOfSceneConfig(objectReference.config, id);
            if (typeof action.config !== 'undefined') {
              this.setObjectOfSceneConfig(action.config, id);
            }
          } else {
            id = this.createSceneObject(action.argument, 'auto');
          }

          return this.entities[id];
          break;
        default:
          console.log('Unknown');
          break;
      }
    } catch (e) {
      console.log(`Une action est buguée : ${e.message}`);
      console.log(`Son context : ${action.context}`);
      console.log(`Son objet : ${action.id}`);
      console.log(`Sa methode : ${action.method}`);
      console.log(`Son Argument : ${action.argument}`);
    }
  }
  /**
   * Generate an objectofscene
   * @method setObjectOfSceneConfig
   * @param {object} config - config
   * @param {string} id - boject id
   * @return {void}
   */
  setObjectOfSceneConfig(config, id) {
    const length = config.length;
    const objectConfig = Clone.cloneComplexObject(config);

    for (let x = 0; x < length; x++) {
      this.setAction(objectConfig[x], id, '');
    }
  }
  /**
   * Generate an objectofscene
   * @method createSceneObject
   * @param {object} configuration - object conf
   * @param {string} id - id
   * @return {string} objectId
   */
  createSceneObject(configuration, id) {
    const objectId = id !== 'auto' ? id : IdGenerator.generate();
    const objectConf = Clone.cloneDataObject(configuration);

    this.entities[objectId] = EntitiesFactory.getInstance(
      objectConf.type,
      {
        properties: objectConf,
        id: objectId
      }
    );

    return objectId;
  }
  /**
   * Generate an objectofscene
   * @method collisionStart
   * @param {contact} contact - contact
   * @return {void}
   */
  collisionStart(contact) {
    this.collisionEffects(contact.m_fixtureA.m_userData, contact.m_fixtureB.m_userData, 'active');
    this.collisionEffects(contact.m_fixtureB.m_userData, contact.m_fixtureA.m_userData, 'active');
  }
  /**
   * Generate an objectofscene
   * @method collisionEnd
   * @param {contact} contact - contact
   * @return {void}
   */
  collisionEnd(contact) {
    this.collisionEffects(contact.m_fixtureA.m_userData, contact.m_fixtureB.m_userData, 'end');
    this.collisionEffects(contact.m_fixtureB.m_userData, contact.m_fixtureA.m_userData, 'end');
  }
  /**
   * Generate an objectofscene
   * @method collisions
   * @return {void}
   */
  collisions() {
    const collisions = this.physicInterface.getCollision();
    const lengthX = collisions.start.length;
    const lengthY = collisions.active.length;
    const lengthZ = collisions.end.length;

    for (let x = 0; x < lengthX; x++) {
      this.collisionEffects(collisions.start[x].bodyA, collisions.start[x].bodyB, 'start');
      this.collisionEffects(collisions.start[x].bodyB, collisions.start[x].bodyA, 'start');
    }
    for (let y = 0; y < lengthY; y++) {
      this.collisionEffects(collisions.active[y].bodyA, collisions.active[y].bodyB, 'active');
      this.collisionEffects(collisions.active[y].bodyB, collisions.active[y].bodyA, 'active');
    }
    for (let z = 0; z < lengthZ; z++) {
      this.collisionEffects(collisions.end[z].bodyA, collisions.end[z].bodyB, 'end');
      this.collisionEffects(collisions.end[z].bodyB, collisions.end[z].bodyA, 'end');
    }
  }
  /**
   * Generate an objectofscene
   * @method collisionsEffects
   * @param {string} hitboxA - id
   * @param {string} hitboxB - id
   * @param {string} type - type
   * @return {void}
   */
  collisionEffects(hitboxA, hitboxB, type) {
    const lengthY = this.physicProfils.length;

    for (let y = 0; y < lengthY; y++) {
      if (typeof this.physicProfils[y][type][this.entities[hitboxA].name] !== 'undefined') {
        if (typeof this.physicProfils[y][type][this.entities[hitboxA].name][this.entities[hitboxB].name] !== 'undefined') {
          const actions = Clone.cloneDataObject(
            this.physicProfils[y][type][this.entities[hitboxA].name][this.entities[hitboxB].name]
          );
          const length = actions.length;

          for (let x = 0; x < length; x++) {
            this.setAction(actions[x], this.entities[hitboxA].parent.id, this.entities[hitboxB].parent.id);
          }
        }
      }
    }
  }
  /**
   * Execute action on all entities of a group
   * @method entityGroupAction
   * @param {object} actionGroup - Object actionGroup
   * @return {void}
   */
  entityGroupAction(actionGroup) {
    const groupLength = actionGroup.group.length;
    const actionLength = actionGroup.actions.length;
    const cloneActions = Clone.cloneDataObject(actionGroup.actions);

    for (let y = 0; y < groupLength; y++) {
      for (let x = 0; x < actionLength; x++) {
        this.setAction(cloneActions[x], actionGroup.group[y], null);
      }
    }
  }
}
