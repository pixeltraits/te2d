/**
   * Load contents configuration
   * @class Game
   * @param {string} configUrl
   * @param {string} gameConfigUrl
   * @param {function} onLoad
   */
class Game {
  constructor(configUrl, gameConfigUrl, onLoad) {
    var self = this;
    this.configUrl = configUrl;
    this.lang = 'fr';
    this.widthGame = 800;
    this.heightGame = 600;
    this.fullscreen = false;
    this.canvasId = "";
    this.loaderConfig = "loader.json";
    this.entitiesFactory = new EntitiesFactory();
    this.idGenerator = new IdGenerator();

    //Content loader
    this.audioLoader = new AudioLoader();
    this.jsonLoader = new JsonLoader();
    this.bitmapLoader = new BitmapLoader();

    //Game Ressources for one Level
    this.bitmaps = [];
    this.audios = [];
    this.audioContext = this.audioLoader.getContext();
    this.entities = [];
    this.entityGroups = [];
    this.texts = [];
    this.controlers = [];
    this.controlers['keyboard'] = [];
    this.controlers['mouse'] = [];
    this.scene = [];

    //Game Ressources configuration for one Level
    this.animations = [];
    this.audioProfils = [];
    this.entityProfils = [];
    this.keyboardProfils = [];
    this.mouseProfiles =  [];
    this.textProfils =  [];
    this.physicProfils =  [];

    //Physic Engine(Interface)
    this.physicInterface = new PhysicInterface(
      function(contact){
        self.collisionStart(contact);
      },
      function(contact) {
        self.collisionEnd(contact);
      }
    );
    this.game = this;

    //Load game config file
    this.jsonLoader.load({
      url : this.configUrl + gameConfigUrl,
      onLoad : function(gameConfig, reference) {
        self.lang = gameConfig.lang != undefined ? gameConfig.lang : self.lang;
        self.widthGame = gameConfig.widthGame != undefined ? gameConfig.widthGame : self.widthGame;
        self.heightGame = gameConfig.heightGame != undefined ? gameConfig.heightGame : self.heightGame;
        self.displayMode = gameConfig.displayMode != undefined ? gameConfig.displayMode : self.displayMode;
        self.bitmapLoader = gameConfig.bitmapLoader != undefined ? gameConfig.bitmapLoader : self.bitmapLoader;
        self.canvasId = gameConfig.canvasId;

        self.camera = new Camera({
          "name": gameConfig.cameraName,
          "scale": 1,
          "canvasId": self.canvasId,
          "displayMode": self.displayMode,
          "dx": self.widthGame,
          "dy": self.heightGame,
        }, "default");

        self.jsonLoader.load({
          url : self.configUrl + gameConfig.loaderConfig,
          onLoad : function(bitmapConfig, reference) {
            self.bitmapLoader.load({
              url : self.configUrl+bitmapConfig.bitmapUrl,
              onLoad : function(bitmap, reference) {
                const cameraSize = self.camera.getSize();
                self.loader = new Loader(
                  bitmap,
                  bitmapConfig,
                  {
                    dx : cameraSize.dx,
                    dy : cameraSize.dy,
                    context : self.camera.ctx
                  },
                  function(){}
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
     * @param {string} name
     * @param {function} onLoad
     */
  loadLevel(name, onLoad) {
    var self = this;
    this.loader.setOnCompleteMethod(onLoad);

    this.jsonLoader.load({
      url : self.configUrl + "/levels/"+name+".json",
      onLoad : function(levelConfig, reference) {
        self.level = levelConfig.levelInfo;
        self.startProperties = {
          startActions : levelConfig.startActions,
          startObjects : levelConfig.entities
        };

        //Load Texts
        self.loadContent(
          self.configUrl + "resources/texts/"+self.lang+"/",
          levelConfig.texts,
          self.jsonLoader,
          function(texts){//When all contents are loaded
            self.texts = texts;
            self.loader.addPourcentLoaded(10);
          },
          function(text){//When One contents is loaded
            self.loader.upTextInfo("Le text "+text.name+" a été chargé.");
          }
        );
        //Load Collisions
        self.loadContent(
          self.configUrl + "resources/physicProfils/",
          levelConfig.physicProfils,
          self.jsonLoader,
          function(physicProfils){//When all contents are loaded
            self.physicProfils = physicProfils;
            self.loader.addPourcentLoaded(10);
          },
          function(physicProfil){//When One contents is loaded
            self.loader.upTextInfo("Les collisions "+physicProfil.name+" ont été chargées.");
          }
        );
        //Load textProfils
        self.loadContent(
          self.configUrl + "resources/textProfils/",
          levelConfig.textProfils,
          self.jsonLoader,
          function(textProfils){//When all contents are loaded
            self.textProfils = textProfils;
            self.loader.addPourcentLoaded(10);
          },
          function(textProfil){//When One contents is loaded
            self.loader.upTextInfo("Le design de text "+textProfil.name+" a été chargé.");
          }
        );
        //Load bitmaps and theirs configurations
        self.loadContent(
          self.configUrl + "resources/bitmaps/",
          levelConfig.bitmaps,
          self.bitmapLoader,
          function(bitmaps){//When all contents are loaded
            self.bitmaps = bitmaps;
            //load Configurations
            self.loadContent(
              self.configUrl + "resources/animations/",
              levelConfig.animations,
              self.jsonLoader,
              function(animations){//When all contents are loaded
                //Load animations group
                self.loadContent(
                  self.configUrl + "resources/animations/",
                  levelConfig.animationsGroups,
                  self.jsonLoader,
                  function(animationsGroups){//When all contents are loaded
                    self.loader.addPourcentLoaded(10);
                  },
                  function(animationsGroup){//When One content is loaded
                    var tab = [],
                    x = 0,
                    length = animationsGroup.length;
                    for(; x < length; x++){
                      tab[x] = self.animations[animationsGroup[x]][0];
                    }
                    self.animations[animationsGroup.name] = tab;
                    self.loader.upTextInfo("Le groupe d'animation "+animationsGroup.name+" a été chargé.");
                  }
                );
                self.loader.addPourcentLoaded(10);
              },
              function(animation){//When One content is loaded
                animation.bitmap = self.bitmaps[animation.bitmap];
                self.animations[animation.name] = [animation];
                self.loader.upTextInfo("L'animation "+animation.name+" a bien été chargé.");
              }
            );
            self.loader.addPourcentLoaded(10);
          },
          function(bitmap){//When One content is loaded
            self.loader.upTextInfo("L'image "+bitmap.name+" a été chargé.");
          }
        );

        //Load audio files and theirs configurations
        self.loadContent(
          self.configUrl + "resources/audios/",
          levelConfig.audios,
          self.audioLoader,
          function(audios) {//When all contents are loaded
            self.audios = audios;
            //load profils
            self.loadContent(
              self.configUrl + "resources/audioProfils/",
              levelConfig.audioProfils,
              self.jsonLoader,
              function(audioProfils) {//When all contents are loaded
                self.audioProfils = audioProfils;
                self.loader.addPourcentLoaded(10);
              },
              function(audioProfil) {//When One content is loaded
                audioProfil.audio = self.audios[audioProfil.audio];
                self.loader.upTextInfo("La configuration du fichier audio "+audioProfil.name+" a été chargé.");
              }
            );
            self.loader.addPourcentLoaded(10);
          },
          function(audio) {//When One content is loaded
            self.loader.upTextInfo("Le fichier audio "+audio.name+" a été chargé.");
          }
        );

        //Load objects of scene
        self.loadContent(
            self.configUrl + "resources/entityProfils/",
            levelConfig.entityProfils,
            self.jsonLoader,
            function(entityProfils) {//When all contents are loaded
              self.entityProfils = entityProfils;
              //Generation des objets
              var length = levelConfig.entities.length,
                  x = 0;
              for(; x < length; x++) {
                self.createSceneObject(self.entityProfils[levelConfig.entities[x].objectConf], levelConfig.entities[x].id);
              }

              self.loader.addPourcentLoaded(10);
              //Configuration of Entity groups -- 0.9
              //x = 0;
              //length = levelConfig.entityGroups.length;

              //var y = 0,
              //    layer;
              //for(; x < length; x++){
              //  var lengthY = levelConfig.entityGroups[x].objectList.length;
              //  layer = [];
              //  for(; y < lengthY; y++){
              //    layer[y] = self.entities[levelConfig.entityGroups[x].objectList[y]];
              //  }
              //  self.entityGroups[levelConfig.entityGroups[x].name] = layer;
              //}

            },
            function(entityProfil) {//When One content is loaded
              self.loader.upTextInfo("La configuration de l'objet "+entityProfil.name+" a été chargé.");
            }
        );

        //Load Command systeme
        if(navigator.userAgent.match(/(android|iphone|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
        } else {
          //Mouse -- 1.0
          //Keyboard
          self.loadContent(
            self.configUrl + "resources/controlerProfils/keyboards/",
            levelConfig.keyboard,
            self.jsonLoader,
            function(players){//When all contents are loaded
              self.loader.addPourcentLoaded(10);
            },
            function(player){//When One content is loaded
              self.controlers['keyboard'][player.config.player] = new Keyboard(
                window,
                function(keyInfo) {//keydown
                  if(typeof player.keys[keyInfo.code] != 'undefined') {
                    var x = 0,
                    length = player.keys[keyInfo.code].down.length;

                    for(; x < length; x++) {
                      self.setAction(player.keys[keyInfo.code].down[x], '', '');
                    }
                  }
                },
                function(keyInfo) {//keyup
                  if(typeof player.keys[keyInfo.code] != 'undefined') {
                    var x = 0,
                    length = player.keys[keyInfo.code].up.length;

                    for(; x < length; x++) {
                      self.setAction(player.keys[keyInfo.code].up[x], '', '');
                    }
                  }
                }
              );
              self.loader.upTextInfo("Les commandes de "+player.name+" a été chargé.");
            }
          );
        }

        //Creation of the graphic scene
        self.scene['graphic'] = new Scene(
          {
            dx: self.level.widthScene,
            dy: self.level.heightScene
          },
          self.level.ratioScene
        );
        //Creation of the physic scene
        self.scene['physic'] = new Scene(
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
     * Load contents configuration
     * @method loadContent
     * @param {string} url
     * @param {array} list
     * @param {contentLoader} contentLoader
     * @param {function} allContentLoad
         * @param {object[]} contents
         * @param {object} content
     * @param {function} oneContentLoad
     */
  loadContent(url, list, contentLoader, allContentLoad, oneContentLoad) {
    try {
      var contents = [],
          length = list.length,
          x = 0,
          y = 0;
      if(length > 0) {
        for(; x < length; x++) {
          contentLoader.load({
            ref : list[x].name,
            url : url+list[x].content,
            onLoad : function(content, reference) {
              contents[reference] = content;
              oneContentLoad(contents[reference]);
              y++;
              if(y >= length) {
                allContentLoad(contents);
              }
            }
          });
        }
      } else {
        allContentLoad([]);
      }
    }
    catch(e) {
      console.log(e.message);
    }
  }
  /**
     * Start the loaded level
     * @method startLevel
     */
  startLevel() {
    var self = this;

    var myMap = new Map([
      [ "id1", "test1" ],
      [ "id2", "test2" ],
    ]);

    var myObject = {
      "test1": "value",
      "test2": "value",
      "test3": "value",
      "test4": "value",
      "test5": "value",
      "test6": "value",
      "test7": "value",
      "test8": "value",
      "test9": "value",
      "test10": "value",
      "test11": "value",
      "test12": "value",
      "test13": "value",
      "test14": "value",
      "test15": "value",
      "test16": "value",
      "test17": "value",
      "test18": "value",
      "test19": "value",
      "test20": "value"
    };
    var myTab = [];
    for(var y=0; y<10000;y++) {
      myTab[y] = "value";
    }

    var time = new Date();
    for (var prop in myObject) {

    }

    time = new Date();
    var length = myTab.length,
        x=0;
    for(; x<length;x++) {

    }


    this.entities[this.level.cameraId].setDisplayUpdateMethod(function(framerate) {
      const cameraSize = self.entities[self.level.cameraId].getSize();
      var inView = self.scene['graphic'].getEntities({
            x : self.entities[self.level.cameraId].position.x,
            y : self.entities[self.level.cameraId].position.y,
            dx : cameraSize.dx,
            dy : cameraSize.dy
          }),
          inPhysic = self.scene['physic'].getEntities({
            x : self.entities[self.level.cameraId].position.x,
            y : self.entities[self.level.cameraId].position.y,
            dx : cameraSize.dx,
            dy : cameraSize.dy
          }),
          x=0,
          length = inView.length;
        //console.log(self.scene['physic'])
      //Increase sort of the objects by z propertie
      inView.sort(function(a, b) {
        const entityPosition = self.entities[a].getPosition();
        return (entityPosition.z > entityPosition.z) ? 1 : -1;
      });

        //console.log(self.entities['50ib636f-8779-47d5-9fcb-ff98c8583dec'])

      //Update of display------------------------------------
      //Clear display
      self.entities[self.level.cameraId].ctx.clearRect(
        0,
        0,
        cameraSize.dx + cameraSize.dx,
        cameraSize.dy + cameraSize.dy
      );

      //Call of entities graphic system
      for(; x < length; x++) {
        self.entities[inView[x]].updateGraphicObject(
          self.entities[self.level.cameraId].ctx,
          {
            dx : cameraSize.dx,
            dy : cameraSize.dy
          },
          {
            x : self.entities[self.level.cameraId].position.x,
            y : self.entities[self.level.cameraId].position.y
          }
        );
      }
      x = 0;
      length = inPhysic.length;

      //Call of entities graphic system
      for(; x < length; x++) {
        self.entities[inPhysic[x]].updatePhysicPosition();
      }

      self.physicInterface.updateEngine(framerate, 6, 2);
    });

    //Camera configuration for the level
    this.entities[this.level.cameraId].setPosition({
      x: this.level.xCam,
      y: this.level.yCam
    });
    this.entities[this.level.cameraId].setDisplaySize({
      dx: this.level.widthCam,
      dy: this.level.heightCam
    });
    this.entities[this.level.cameraId].activeFullwindow();

    var lengthX = this.startProperties.startObjects.length,
    x = 0,
    lengthY = this.startProperties.startActions.length,
    y = 0;
    for(; x < lengthX; x++) {
      this.setObjectOfSceneConfig(
        this.entityProfils[this.startProperties.startObjects[x].objectConf].config,
        this.startProperties.startObjects[x].id
      );
    }

    var obj = this.startProperties.startActions[y];
    for(; y < lengthY; y++) {
      this.setAction(this.startProperties.startActions[y], '', '');
    }

    this.entities[this.level.cameraId].start();
  }
  destroyLevel() {
    //this.controlers['mouse'].killAllEvent();
    this.camera.stop();
  }
  /**
     * Clone json configuration
     * @method clone
     * @param {json object} jsonObject
     */
  clone(jsonObject) {
    if(typeof jsonObject != "undefined") {
      return JSON.parse(JSON.stringify(jsonObject));
    } else {
      console.log("L'objet json à cloner est indéfini.");
    }
  }
  /**
     * Json actions
     * @method setObjectOfSceneConfig
     * @param {action} actionConfiguration
     * @return the result function called by the action
     */
  setAction(actionConfiguration, self, him) {
    var action = this.clone(actionConfiguration);
    //try {
      switch(action.type) {
        case "action" :
          if(action.id != false) {
            switch(action.id) {
              case "self":
                action.id = self;
                break;
              case "him":
                action.id = him;
                break;
            }
            var objectReference = this[action.context][action.id];
          } else {
            var objectReference = this[action.context];
          }
          return objectReference[action.method](this.setAction(action.argument, self, him));
          break;
        case "simple" :
          return action.argument;
          break;
        case "resource" :
          if(action.id != false) {
            switch(action.id) {
              case "self":
                action.id = self;
                break;
              case "him":
                action.id = him;
                break;
            }
            return this[action.context][action.id];
          }  else {
            return this[action.context];
          }
          break;
        case "object" :
          var resource = {},
              x = 0,
              length = action.properties.length;

          for(; x < length; x++) {
            resource[action.properties[x].name] = this.setAction(action.properties[x].content, self, him);
          }

          return resource;
          break;
        case "newObject" :
          if(action.context != false) {
            if(action.id != false) {
              switch(action.id) {
                case "self":
                  action.id = self;
                  break;
                case "him":
                  action.id = him;
                  break;
              }
              var objectReference = this[action.context][action.id];
            } else {
              var objectReference = this[action.context];
            }
            var id = this.createSceneObject(objectReference, "auto");
            this.setObjectOfSceneConfig(objectReference.config, id);
            if(typeof action.config != 'undefined') {
              this.setObjectOfSceneConfig(action.config, id);
            }
          } else {
            var id = this.createSceneObject(action.argument, "auto");
          }

          return this.entities[id];
          break;
      }
    //} catch(e) {
      //console.log("Une action est buguée : ", e.message);
      //console.log("Son context : ", action.context);
      //console.log("Son objet : ", action.id);
      //console.log("Sa methode : ", action.method);
      //console.log("Son Argument : ", action.argument);
    //}
  }
  /**
     * Generate an objectofscene
     * @method setObjectOfSceneConfig
     * @param { pre configuration of the object } config
     * @param id
     */
  setObjectOfSceneConfig(config, id) {
    var length = config.length,
    objectConfig = this.clone(config),
    x = 0;
    for(; x < length; x++) {
      this.setAction(objectConfig[x], id, '');
    }
  }
  /**
     * Generate an objectofscene
     * @method createSceneObject
     * @param { configuration of the object } objectConf
     * @param id
     * @return objectId
     */
  createSceneObject(configuration, id) {
    var objectId = id != "auto" ? id : IdGenerator.generate(),
        objectConf = this.clone(configuration);

    this.entities[objectId] = this.entitiesFactory.getInstance(
      objectConf.type,
      {
        properties : objectConf,
        id : objectId
      }
    );

    return objectId;
  }
  /**
     * Generate an objectofscene
     * @method collisionStart
     */
  collisionStart(contact) {
    this.collisionEffects(contact.m_fixtureA.m_userData, contact.m_fixtureB.m_userData, 'active');
    this.collisionEffects(contact.m_fixtureB.m_userData, contact.m_fixtureA.m_userData, 'active');
  }
  /**
     * Generate an objectofscene
     * @method collisionEnd
     */
  collisionEnd(contact) {
    this.collisionEffects(contact.m_fixtureA.m_userData, contact.m_fixtureB.m_userData, 'end');
    this.collisionEffects(contact.m_fixtureB.m_userData, contact.m_fixtureA.m_userData, 'end');
  }
  /**
     * Generate an objectofscene
     * @method collisions
     */
  collisions() {
    var collisions = this.physicInterface.getCollision(),
    x=0,
    lengthX = collisions.start.length,
    y=0,
    lengthY = collisions.active.length,
    z=0,
    lengthZ = collisions.end.length;

    for(; x < lengthX; x++){
      this.collisionEffects(collisions.start[x].bodyA, collisions.start[x].bodyB, 'start');
      this.collisionEffects(collisions.start[x].bodyB, collisions.start[x].bodyA, 'start');
    }
    for(; y < lengthY; y++){
      this.collisionEffects(collisions.active[y].bodyA, collisions.active[y].bodyB, 'active');
      this.collisionEffects(collisions.active[y].bodyB, collisions.active[y].bodyA, 'active');
    }
    for(; z < lengthZ; z++){
      this.collisionEffects(collisions.end[z].bodyA, collisions.end[z].bodyB, 'end');
      this.collisionEffects(collisions.end[z].bodyB, collisions.end[z].bodyA, 'end');
    }
  }
  /**
     * Generate an objectofscene
     * @method collisionsEffects
     * @param hitboxA id
     * @param hitboxB id
     * @param type
     */
  collisionEffects(hitboxA, hitboxB, type) {
    var y = 0,
        lengthY = this.physicProfils.length;

    for(; y < length; y++) {
      if(typeof this.physicProfils[y][type][this.entities[hitboxA].name] != 'undefined') {
        if(typeof this.physicProfils[y][type][this.entities[hitboxA].name][this.entities[hitboxB].name] != 'undefined') {
          var actions = this.clone(this.physicProfils[y][type][this.entities[hitboxA].name][this.entities[hitboxB].name]),
          x = 0,
          length = actions.length;

          for(; x < length; x++) {
            this.setAction(actions[x], this.entities[hitboxA].parent.id, this.entities[hitboxB].parent.id);
          }
        }
      }
    }
  }
  //Systeme de pause a revoir entierement une fois le reste du systeme revu
  setPause() {
    var length = this.group.length,
    x=0;
    for(;x<length;x++){

    }
  }
  unsetPause() {
    var length = this.group.length,
    x=0;
    for(;x<length;x++){

    }
  }
}
