class Player2D extends PhysicEntity {
  constructor(properties, id) {
    super(properties, id);

    this.accRight = 0;
    this.accLeft = 0;
    this.maxSpeed = 3;
  }
  spring(vector) {
    this.physicInterface.setImpulse(this.physicBody, vector);
  }
  setWalk(walkObject) {
    switch(walkObject.direction) {
      case "right" :
        this.accRight = walkObject.acc;
        break;
      case "left" :
        this.accLeft = -walkObject.acc;
        break;
    }
    this.maxSpeed = walkObject.speed;
  }
  unsetWalk(direction) {
    var velocity =  this.getVelocity();
    switch(direction) {
      case "right" :
        this.accRight = 0;
        break;
      case "left" :
        this.accLeft = 0;
        break;
    }
  }
  update() {
    super.update();

    var velocity = this.getVelocity(),
        force = {
          x : 0,
          y : 0
        };

    if(velocity.x < this.maxSpeed) {
      force.x += this.accRight;
    }
    if(velocity.x > -this.maxSpeed) {
      force.x += this.accLeft;
    }
    if(this.accLeft == 0 && this.accRight == 0) {
      this.physicInterface.stopForces(this.physicBody);
    }

    this.setVelocity(force);
  }
}
