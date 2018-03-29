import Clone from '../../api/layer1/Clone.js';

/**
 * Load contents configuration
 * @class Collision
 */
export default class Collision {
  /**
   * constructor
   * @method constructor
   * @param {array} entities - entities
   * @param {array} physicProfils - physicProfils
   * @param {object} actionSystem - actionSystem
   * @return {void}
   */
  constructor(entities, physicProfils, actionSystem) {
    this.entities = entities;
    this.physicProfils = physicProfils;
    this.actionSystem = actionSystem;
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
            this.actionSystem.setAction(actions[x], this.entities[hitboxA].parent.id, this.entities[hitboxB].parent.id);
          }
        }
      }
    }
  }
}
