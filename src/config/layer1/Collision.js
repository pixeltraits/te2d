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
   * @method collisionEnd
   * @param {contact} contact - contact
   * @return {void}
   */
  collisionStart(contact) {
    this.collisionEffects(contact.m_fixtureA.m_userData, contact.m_fixtureB.m_userData, 'start');
    this.collisionEffects(contact.m_fixtureB.m_userData, contact.m_fixtureA.m_userData, 'start');
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
   * @method collisionsEffects
   * @param {hitboxInfos} hitboxInfosA
   * @param {hitboxInfos} hitboxInfosB
   * @param {string} type - type
   * @return {void}
   */
  collisionEffects(hitboxInfosA, hitboxInfosB, type) {
    const hitboxA = this.entities[hitboxInfosA.bodyId].getHitbox(hitboxInfosA.fixtureId);
    const hitboxB = this.entities[hitboxInfosB.bodyId].getHitbox(hitboxInfosB.fixtureId);

    Object.keys(this.physicProfils).forEach((physicProfil) => {
      const hitboxAEffects = this.physicProfils[physicProfil][type][hitboxA.fixture.name];

      if (typeof hitboxAEffects !== 'undefined') {
        const hitboxABEffects = hitboxAEffects[hitboxB.fixture.name];

        if (typeof hitboxABEffects !== 'undefined') {
          const actions = Clone.cloneDataObject(hitboxABEffects);
          const length = actions.length;

          for (let x = 0; x < length; x++) {
            this.actionSystem.setAction(actions[x], hitboxInfosA.bodyId, hitboxInfosB.bodyId);
          }
        }
      }
    });
  }
}
