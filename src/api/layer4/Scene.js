/**
 * Scene Manager
 * @class Scene
 * @param {size} size
 * @param {number} ratio
 */
﻿class Scene {
  constructor(size, ratio) {
    this.map = [];
    this.ratio = ratio;

    this.cases = {
      x : Math.ceil(size.dx / this.ratio),
      y : Math.ceil(size.dy / this.ratio)
    };

    for(var x = 0; x < this.cases.x; x++) {
      this.map[x] = [];
      for(var y = 0; y < this.cases.y; y++) {
        this.map[x][y] = [];
      }
    }
  }
  /**
   * Get entities in the zone defined
   * @method getEntities
   * @param {zone} zone
   * @return {entity[]} entities
   */
  getEntities(zone) {
    var firstCaseX = Math.floor(zone.x / this.ratio),
        firstCaseY = Math.floor(zone.y / this.ratio),
        lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio),
        lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio),
        entities = [],
        list = [],
        x = firstCaseX;

    for(; x < lastCaseX; x++) {
      /* Read every cases in x between zone.x and zone.dx */
      for(var y = firstCaseY; y < lastCaseY; y++) {
        /* Read every cases in y between zone.y and zone.dy */
        var length = this.map[x][y].length,
            z=0;

        for(; z < length; z++) {
          /* Read every entity in this case */
          if(typeof list[this.map[x][y][z]] == "undefined") {
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
   * @param {zone} oldZone
   * @param {zone} newZone
   * @param {string} id
   */
  update(oldZone, newZone, id) {
    this.delete(oldZone, id);
    this.add(newZone, id);
  }
  /**
   * Add entity in map
   * @method add
   * @param {zone} zone
   * @param {string} id
   */
  add(zone, id) {
    var firstCaseX = Math.floor(zone.x / this.ratio),
        firstCaseY = Math.floor(zone.y / this.ratio),
        lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio),
        lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio),
        x = firstCaseX;

    for(; x < lastCaseX; x++) {
      for(var y = firstCaseY; y < lastCaseY; y++) {
        this.map[x][y][this.map[x][y].length] = id;
      }
    }
  }
  /**
   * Delete entity in map
   * @method delete
   * @param {zone} zone
   * @param {string} id
   */
  delete(zone, id) {
    var firstCaseX = Math.floor(zone.x / this.ratio),
      firstCaseY = Math.floor(zone.y / this.ratio),
      lastCaseX = Math.ceil((zone.x + zone.dx) / this.ratio),
      lastCaseY = Math.ceil((zone.y + zone.dy) / this.ratio),
      x = firstCaseX;

    for(;x < lastCaseX;x++){
      for(var y = firstCaseY; y < lastCaseY; y++) {
        var length = this.map[x][y].length,
            z = 0;

        for(; z < length; z++) {
          if(this.map[x][y][z] == id) {
            this.map[x][y].splice(z, 1);
          }
        }
      }
    }
  }
}
