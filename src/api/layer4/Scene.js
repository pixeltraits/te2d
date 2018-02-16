/**
 * Scene Manager
 * @class Scene
 */
﻿class Scene {
  /**
   * Scene Manager
   * @method constructor
   * @param {size} size - Size of the map
   * @param {number} ratio - Ratio of the map
   */
  constructor(size, ratio) {
    this.map = [];
    this.ratio = ratio;

    this.cases = {
      x: Math.ceil(size.dx / this.ratio),
      y: Math.ceil(size.dy / this.ratio)
    };

    for (let x = 0; x < this.cases.x; x++) {
      this.map[x] = [];
      for (let y = 0; y < this.cases.y; y++) {
        this.map[x][y] = [];
      }
    }
  }
  /**
   * Get entities in the zone defined
   * @method getEntities
   * @param {zone} zone - Zone
   * @return {entity[]} entities
   */
  getEntities(zone) {
    const firstCaseX = Math.floor(zone.x / this.ratio);
    const firstCaseY = Math.floor(zone.y / this.ratio);
    const lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio);
    const lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio);
    const entities = [];
    const list = [];

    for (let x = firstCaseX; x < lastCaseX; x++) {
      /* Read every cases in x between zone.x and zone.dx */
      for (let y = firstCaseY; y < lastCaseY; y++) {
        /* Read every cases in y between zone.y and zone.dy */
        const length = this.map[x][y].length;

        for (let z = 0; z < length; z++) {
          /* Read every entity in this case */
          if (typeof list[this.map[x][y][z]] === 'undefined') {
            /* The entity is not set yet */
            entities[entities.length] = this.map[x][y][z];
            list[this.map[x][y][z]] = true;
          }
        }
      }
    }

    return entities;
  }
  /**
   * Update entity position
   * @method update
   * @param {zone} oldZone - Previous localization zone
   * @param {zone} newZone - Next localization zone
   * @param {string} id - Id entity to search
   * @return {void}
   */
  update(oldZone, newZone, id) {
    this.delete(oldZone, id);
    this.add(newZone, id);
  }
  /**
   * Add entity in map
   * @method add
   * @param {zone} zone - Search zone
   * @param {string} id - Id entity to search
   * @return {void}
   */
  add(zone, id) {
    const firstCaseX = Math.floor(zone.x / this.ratio);
    const firstCaseY = Math.floor(zone.y / this.ratio);
    const lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio);
    const lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio);

    for (let x = firstCaseX; x < lastCaseX; x++) {
      for (let y = firstCaseY; y < lastCaseY; y++) {
        this.map[x][y].push(id);
      }
    }
  }
  /**
   * Delete entity in map
   * @method delete
   * @param {zone} zone - Search zone
   * @param {string} id - Id entity to search
   * @return {void}
   */
  delete(zone, id) {
    const firstCaseX = Math.floor(zone.x / this.ratio);
    const firstCaseY = Math.floor(zone.y / this.ratio);
    const lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio);
    const lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio);

    for (let x = firstCaseX; x < lastCaseX; x++) {
      for (let y = firstCaseY; y < lastCaseY; y++) {
        const length = this.map[x][y].length;

        for (let z = 0; z < length; z++) {
          if (this.map[x][y][z] === id) {
            this.map[x][y].splice(z, 1);
          }
        }
      }
    }
  }
}
