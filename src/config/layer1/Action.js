import Logger from '../../api/layer1/Logger.js';
import Clone from '../../api/layer1/Clone.js';
import Ia from '../../api/layer3/Ia.js';
import IdGenerator from '../../api/layer1/IdGenerator.js';
import EntitiesFactory from './EntitiesFactory.js';

/**
 * Load contents configuration
 * @class Game
 */
export default class Action {
  /**
   * constructor
   * @method constructor
   * @param {object} resources - resources
   * @return {void}
   */
  constructor(resources) {
    this.resources = resources;
    this.resources.actionSystem = this;
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
    let returnValue = null;

    try {
      switch (action.type) {
        case 'action':
          returnValue = this.executeAction(action, self, him);
          break;
        case 'simple':
          returnValue = action.argument;
          break;
        case 'resource':
          returnValue = this.getResource(action, self, him);
          break;
        case 'object':
          returnValue = this.getObjectResource(action, self, him);
          break;
        case 'newObject':
          returnValue = this.getNewObject(action, self, him);
          break;
        case 'callbacks':
          returnValue = this.generateCallbacks(action, self);
          break;
        default:
          Logger.log('Unknown');
          break;
      }
    } catch (e) {
      Logger.log(`Une action est buguée : ${e.message}`);
      Logger.log(`Son context : ${action.context}`);
      Logger.log(`Son objet : ${action.id}`);
      Logger.log(`Sa methode : ${action.method}`);
      Logger.log(`Son Argument : ${action.argument}`);
    }

    return returnValue;
  }
  /**
   * Generate an executeAction
   * @method executeAction
   * @param {object} action - action
   * @param {string} self - self
   * @param {string} him - him
   * @return {void}
   */
  executeAction(action, self, him) {
    const actionClone = action;
    let objectReference = {};

    if (actionClone.id !== false) {
      switch (actionClone.id) {
        case 'self':
          actionClone.id = self;
          break;
        case 'him':
          actionClone.id = him;
          break;
        default:
          break;
      }
      objectReference = this.resources[actionClone.context][actionClone.id];
    } else {
      objectReference = this.resources[actionClone.context];
    }

    objectReference[actionClone.method](this.setAction(actionClone.argument, self, him));
  }
  /**
   * Get a resource
   * @method getResource
   * @param {object} action - action
   * @param {string} self - self
   * @param {string} him - him
   * @return {void}
   */
  getResource(action, self, him) {
    const actionClone = action;

    if (actionClone.id !== false) {
      switch (action.id) {
        case 'self':
          actionClone.id = self;
          break;
        case 'him':
          actionClone.id = him;
          break;
        default:
          break;
      }
      return this.resources[actionClone.context][actionClone.id];
    }

    return this.resources[actionClone.context];
  }
  /**
   * Get a object resource
   * @method getObjectResource
   * @param {object} action - action
   * @param {string} self - self
   * @param {string} him - him
   * @return {void}
   */
  getObjectResource(action, self, him) {
    const length = action.properties.length;
    const actionClone = action;
    const resource = {};

    for (let x = 0; x < length; x++) {
      resource[actionClone.properties[x].name] = this.setAction(actionClone.properties[x].content, self, him);
    }

    return resource;
  }
  /**
   * Generate Callbacks
   * @method generateCallbacks
   * @param {object} action - action
   * @param {string} self - id
   * @return {void}
   */
  generateCallbacks(action, self) {
    const actionClone = action;
    const methodsLength = actionClone.methods.length;
    const resource = [];

    for (let x = 0; x < methodsLength; x++) {
      resource[x] = () => {
        const actions = actionClone.methods[x];
        const actionsLength = actions.length;

        for (let y = 0; y < actionsLength; y++) {
          this.setAction(actions[y], self, null);
        }
      };
    }

    return resource;
  }
  /**
   * Get a new object
   * @method getNewObject
   * @param {object} action - action
   * @param {string} self - self
   * @param {string} him - him
   * @return {void}
   */
  getNewObject(action, self, him) {
    const actionClone = action;
    let objectReference = {};
    let id = null;

    if (actionClone.context !== false) {
      if (actionClone.id !== false) {
        switch (actionClone.id) {
          case 'self':
            actionClone.id = self;
            break;
          case 'him':
            actionClone.id = him;
            break;
          default:
            break;
        }
        objectReference = this.resources[actionClone.context][actionClone.id];
      } else {
        objectReference = this.resources[actionClone.context];
      }
      id = this.createSceneObject(objectReference, 'auto');
      this.setObjectOfSceneConfig(objectReference.config, id);
      if (typeof actionClone.config !== 'undefined') {
        this.setObjectOfSceneConfig(actionClone.config, id);
      }
    } else {
      id = this.createSceneObject(actionClone.argument, 'auto');
    }

    return this.resources.entities[id];
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

    this.resources.entities[objectId] = EntitiesFactory.getInstance(
      objectConf.type,
      {
        properties: objectConf,
        id: objectId
      }
    );

    return objectId;
  }
  /**
   * Generate an Ia
   * @method createSceneObject
   * @param {object} configuration - object conf
   * @param {string} id - id
   * @return {string} objectId
   */
  createIaObject(configuration, id) {
    const objectId = id !== 'auto' ? id : IdGenerator.generate();
    const objectConf = Clone.cloneDataObject(configuration);

    this.resources.ias[objectId] = new Ia(
      objectId,
      objectConf
    );

    return objectId;
  }
}
