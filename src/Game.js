import PhysicBox2D from './api/layer3/PhysicBox2D.js';
import Camera from './api/layer5/Camera.js';
import LoadUtils from './config/layer1/LoadUtils.js';
import Loader from './config/layer1/Loader.js';
import Keyboard from './api/layer3/Keyboard.js';
import Scene from './api/layer4/Scene.js';
import Action from './config/layer1/Action.js';
import Collision from './config/layer1/Collision.js';
import Logger from './api/layer1/Logger.js';

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
  constructor(configUrl, gameConfigUrl) {
    this.configUrl = configUrl;
    this.gameConfigUrl = gameConfigUrl;
    this.lang = 'fr';
    this.widthGame = 800;
    this.heightGame = 600;
    this.fullscreen = false;
    this.canvasId = '';
    this.loaderConfig = 'loader.json';

    // Game Ressources for one Level
    this.resources = {
      bitmaps: [],
      audios: [],
      audioContext: new window.AudioContext(),
      ias: [],
      entities: [],
      entityGroups: {},
      texts: [],
      controlers: {
        keyboard: [],
        mouse: []
      },
      scene: [],
      animations: [],
      audioProfils: [],
      entityProfils: [],
      iaProfils: [],
      keyboardProfils: [],
      mouseProfiles: [],
      textProfils: [],
      physicProfils: [],
      physicInterface: {},
      actionSystem: {},
      game: this
    };

    this.actionSystem = new Action(this.resources);
  }

  async prepareGame() {
    // Load game config file
    const gameConfig = await LoadUtils.jsonLoader({
      url: this.configUrl + this.gameConfigUrl
    });

    this.lang = gameConfig.lang !== 'undefined' ? gameConfig.lang : this.lang;
    this.widthGame = gameConfig.widthGame !== 'undefined' ? gameConfig.widthGame : this.widthGame;
    this.heightGame = gameConfig.heightGame !== 'undefined' ? gameConfig.heightGame : this.heightGame;
    this.displayMode = gameConfig.displayMode !== 'undefined' ? gameConfig.displayMode : this.displayMode;
    this.canvasId = gameConfig.canvasId;

    this.camera = new Camera(
      {
        name: '',
        scale: 1,
        canvasId: this.canvasId,
        displayMode: this.displayMode,
        dx: this.widthGame,
        dy: this.heightGame
      },
      'default'
    );

    const bitmapConfig = await LoadUtils.jsonLoader({
      url: this.configUrl + gameConfig.loaderConfig
    });

    const bitmap = await LoadUtils.bitmapLoader({
      url: this.configUrl + bitmapConfig.bitmapUrl
    });

    const cameraSize = this.camera.getSize();
    this.loader = new Loader(
      bitmap,
      bitmapConfig,
      {
        dx: cameraSize.dx,
        dy: cameraSize.dy,
        context: this.camera.ctx
      },
      () => {
        this.startLevel();
      }
    );
  }
  /**
   * Active fullscreen
   * @method activeFullscreen
   * @return {void}
   */
  activeFullscreen() {
    this.camera.activeFullscreen();
  }
  /**
   * Exit fullscreen
   * @method exitFullscreen
   * @return {void}
   */
  exitFullscreen() {
    this.camera.exitFullscreen();
  }
  /**
   * Load contents configuration
   * @method loadLevel
   * @param {string} name - name
   * @param {function} onLoad - onLoad
   * @return {void}
   */
  async loadLevel(name, onLoad) {
    this.loader.setOnCompleteMethod(onLoad);

    this.levelConfig = await LoadUtils.jsonLoader({
      url: `${this.configUrl}/levels/${name}.json`
    });

    this.level = this.levelConfig.levelInfo;
    this.resources.entityGroups = this.levelConfig.entityGroups;
    this.startProperties = {
      startActions: this.levelConfig.startActions,
      startObjects: this.levelConfig.entities
    };

    this.loadTexts();
    this.loadTextProfils();
    this.loadPhysicProfils();
    this.loadImageContents();
    this.loadAudioContents();
    this.loadObjectsScene();
    this.loadIas();
    this.loadCommandSystem();

    this.createGraphicScene();
    this.createPhysicScene();
  }
  createGraphicScene() {
    this.resources.scene.graphic = new Scene(
      {
        dx: this.level.widthScene,
        dy: this.level.heightScene
      },
      this.level.ratioScene
    );
  }
  createPhysicScene() {
    this.resources.scene.physic = new Scene(
      {
        dx: this.level.widthScene,
        dy: this.level.heightScene
      },
      this.level.ratioScene
    );
  }
  loadCommandSystem() {
    if (navigator.userAgent.match(/(android|iphone|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
      Logger.log('mode tactil');
    } else {
      this.loadKeyboardConfiguration();
    }
  }
  async loadIas() {
    this.resources.iaProfils = await LoadUtils.loadContent(
      `${this.configUrl}resources/iaProfils/`,
      this.levelConfig.iaProfils,
      {
        type: 'jsonLoader',
        context: null
      },
      (iaProfil) => {
        this.loader.upTextInfo(`La configuration de l'objet ${iaProfil.name} a été chargé.`);
      }
    );
    // Generation des objets
    const length = this.levelConfig.ias.length;
    for (let x = 0; x < length; x++) {
      this.actionSystem.createIaObject(
        this.resources.iaProfils[this.levelConfig.ias[x].objectConf],
        this.levelConfig.ias[x].id
      );
    }

    this.loader.addPourcentLoaded(2);
  }
  async loadTextProfils() {
    this.resources.textProfils = await LoadUtils.loadContent(
      `${this.configUrl}resources/textProfils/`,
      this.levelConfig.textProfils,
      {
        type: 'jsonLoader',
        context: null
      },
      (textProfil) => {
        this.loader.upTextInfo(`Le design de text ${textProfil.name} a été chargé.`);
      }
    );

    this.loader.addPourcentLoaded(10);
  }
  async loadTexts() {
    this.resources.texts = await LoadUtils.loadContent(
      `${this.configUrl}resources/texts/${this.lang}/`,
      this.levelConfig.texts,
      {
        type: 'jsonLoader',
        context: null
      },
      (text) => {
        this.loader.upTextInfo(`Le text ${text.name} a été chargé.`);
      }
    );

    this.loader.addPourcentLoaded(10);
  }

  async loadPhysicProfils() {
    this.resources.physicProfils = await LoadUtils.loadContent(
      `${this.configUrl}resources/physicProfils/`,
      this.levelConfig.physicProfils,
      {
        type: 'jsonLoader',
        context: null
      },
      (physicProfil) => {
        this.loader.upTextInfo(`Les collisions ${physicProfil.name} ont été chargées.`);
      }
    );

    this.loader.addPourcentLoaded(10);
  }
  async loadObjectsScene() {
    this.resources.entityProfils = await LoadUtils.loadContent(
      `${this.configUrl}resources/entityProfils/`,
      this.levelConfig.entityProfils,
      {
        type: 'jsonLoader',
        context: null
      },
      (entityProfil) => {
        this.loader.upTextInfo(`La configuration de l'objet ${entityProfil.name} a été chargé.`);
      }
    );
    // Generation des objets
    const length = this.levelConfig.entities.length;
    for (let x = 0; x < length; x++) {
      this.actionSystem.createSceneObject(
        this.resources.entityProfils[this.levelConfig.entities[x].objectConf],
        this.levelConfig.entities[x].id
      );
    }

    this.loader.addPourcentLoaded(8);
  }
  async loadKeyboardConfiguration() {
    await LoadUtils.loadContent(
      `${this.configUrl}resources/controlerProfils/keyboards/`,
      this.levelConfig.keyboard,
      {
        type: 'jsonLoader',
        context: null
      },
      (player) => {
        this.resources.controlers.keyboard[player.config.player] = new Keyboard(
          window,
          (keyInfo) => {
            if (typeof player.keys[keyInfo.code] !== 'undefined') {
              const length = player.keys[keyInfo.code].down.length;

              for (let x = 0; x < length; x++) {
                this.actionSystem.setAction(player.keys[keyInfo.code].down[x], '', '');
              }
            }
          },
          (keyInfo) => {
            if (typeof player.keys[keyInfo.code] !== 'undefined') {
              const length = player.keys[keyInfo.code].up.length;

              for (let x = 0; x < length; x++) {
                this.actionSystem.setAction(player.keys[keyInfo.code].up[x], '', '');
              }
            }
          }
        );
        this.loader.upTextInfo(`Les commandes de ${player.name} a été chargé.`);
      }
    );

    this.loader.addPourcentLoaded(10);
  }
  async loadAudioContents() {
    this.resources.audios = await LoadUtils.loadContent(
      `${this.configUrl}resources/audios/`,
      this.levelConfig.audios,
      {
        type: 'audioLoader',
        context: this.resources.audioContext
      },
      (audio) => {
        this.loader.upTextInfo(`Le fichier audio ${audio.name} a été chargé.`);
      }
    );

    this.loader.addPourcentLoaded(10);

    this.resources.audioProfils = await LoadUtils.loadContent(
      `${this.configUrl}resources/audioProfils/`,
      this.levelConfig.audioProfils,
      {
        type: 'jsonLoader',
        context: null
      },
      (audioProfil) => {
        audioProfil.audio = this.resources.audios[audioProfil.audio];
        this.loader.upTextInfo(`La configuration du fichier audio ${audioProfil.name} a été chargé.`);
      }
    );

    this.loader.addPourcentLoaded(10);
  }

  async loadImageContents() {
    this.resources.bitmaps = await LoadUtils.loadContent(
      `${this.configUrl}resources/bitmaps/`,
      this.levelConfig.bitmaps,
      {
        type: 'bitmapLoader',
        context: null
      },
      (bitmap) => {
        this.loader.upTextInfo(`L'image ${bitmap.name} a été chargé.`);
      }
    );

    this.loader.addPourcentLoaded(10);

    await LoadUtils.loadContent(
      `${this.configUrl}resources/animations/`,
      this.levelConfig.animations,
      {
        type: 'jsonLoader',
        context: null
      },
      (animation) => {
        animation.bitmap = this.resources.bitmaps[animation.bitmap];
        this.resources.animations[animation.name] = [animation];
        this.loader.upTextInfo(`L'animation ${animation.name} a bien été chargé.`);
      }
    );

    this.loader.addPourcentLoaded(10);

    await LoadUtils.loadContent(
      `${this.configUrl}resources/animations/`,
      this.levelConfig.animationsGroups,
      {
        type: 'jsonLoader',
        context: null
      },
      (animationsGroup) => {
        const tab = [];
        const length = animationsGroup.length;

        for (let x = 0; x < length; x++) {
          tab[x] = this.resources.animations[animationsGroup[x]][0];
        }
        this.resources.animations[animationsGroup.name] = tab;
        this.loader.upTextInfo(`Le groupe d'animation ${animationsGroup.name} a été chargé.`);
      }
    );

    this.loader.addPourcentLoaded(10);
  }
  /**
   * Start the loaded level
   * @method startLevel
   * @return {void}
   */
  startLevel() {
    this.collisionSystem = new Collision(this.resources.entities, this.resources.physicProfils, this.actionSystem);
    this.resources.physicInterface = new PhysicBox2D(
      (contact) => {
        this.collisionSystem.collisionStart(contact);
      },
      (contact) => {
        this.collisionSystem.collisionEnd(contact);
      },
      this.level.gravity,
      this.level.pixelFactor
    );

    this.resources.entities[this.level.cameraId].setDisplayUpdateMethod((framerate) => {
      const cameraSize = this.resources.entities[this.level.cameraId].getSize();
      const inView = this.resources.scene.graphic.getEntities({
        x: this.resources.entities[this.level.cameraId].position.x,
        y: this.resources.entities[this.level.cameraId].position.y,
        dx: cameraSize.dx,
        dy: cameraSize.dy
      });
      const inPhysic = this.resources.scene.physic.getEntities({
        x: this.resources.entities[this.level.cameraId].position.x,
        y: this.resources.entities[this.level.cameraId].position.y,
        dx: cameraSize.dx,
        dy: cameraSize.dy
      });
      let length = inView.length;

      // Increase sort of the objects by z propertie
      inView.sort((a, b) => {
        const entityPositionA = this.resources.entities[a].getPosition();
        const entityPositionB = this.resources.entities[b].getPosition();
        return (entityPositionA.z > entityPositionB.z) ? 1 : -1;
      });


      // Update of display------------------------------------
      // Clear display
      this.resources.entities[this.level.cameraId].ctx.clearRect(
        0,
        0,
        cameraSize.dx + cameraSize.dx,
        cameraSize.dy + cameraSize.dy
      );

      // Call of entities graphic system
      for (let x = 0; x < length; x++) {
        this.resources.entities[inView[x]].updateGraphicObject(
          this.resources.entities[this.level.cameraId].ctx,
          {
            dx: cameraSize.dx,
            dy: cameraSize.dy
          },
          {
            x: this.resources.entities[this.level.cameraId].position.x,
            y: this.resources.entities[this.level.cameraId].position.y
          }
        );
      }
      length = inPhysic.length;

      // Call of entities graphic system
      for (let x = 0; x < length; x++) {
        this.resources.entities[inPhysic[x]].updatePhysicPosition();
      }
      length = this.levelConfig.ias.length;
      // Call of entities graphic system
      for (let x = 0; x < length; x++) {
        //this.resources.ias[this.levelConfig.ias[x].id].updateStatus();
      }

      this.resources.physicInterface.updateEngine(framerate, 6, 2);
    });

    // Camera configuration for the level
    this.resources.entities[this.level.cameraId].setPosition({
      x: this.level.xCam,
      y: this.level.yCam
    });
    this.resources.entities[this.level.cameraId].setDisplaySize({
      dx: this.level.widthCam,
      dy: this.level.heightCam
    });
    this.resources.entities[this.level.cameraId].activeFullwindow();

    const lengthX = this.startProperties.startObjects.length;
    const lengthY = this.startProperties.startActions.length;

    for (let x = 0; x < lengthX; x++) {
      this.actionSystem.setObjectOfSceneConfig(
        this.resources.entityProfils[this.startProperties.startObjects[x].objectConf].config,
        this.startProperties.startObjects[x].id
      );
    }

    for (let y = 0; y < lengthY; y++) {
      this.actionSystem.setAction(this.startProperties.startActions[y], '', '');
    }

    this.resources.entities[this.level.cameraId].start();
  }
  /**
   * Destroy level
   * @method destroyLevel
   * @return {void}
   */
  destroyLevel() {
    this.camera.stop();
  }
}
