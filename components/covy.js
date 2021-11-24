class Covy extends Phaser.GameObjects.Sprite {

  constructor(config) {
    super(config.scene, config.x, config.y, "covy");
    
    
    this.setCovyAnims(config.scene);
    
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this);
    
    this.name="covy";

    this.lastmove = null;
    this.layermap = config.layermap;

    config.scene.physics.add.collider(this, config.layermap, this.collisionEvent);

    this.timedEvent = config.scene.time.addEvent({
      delay: 50,
      callback: this.timerEvent,
      callbackScope: this,
      loop: true,
    });
    this.play("covy-walk-left");
    this.doMovement();
  }

  setCovyAnims(scene) {
    scene.anims.create({
      key: "covy-walk-left",
      frames: scene.anims.generateFrameNumbers("ss-corona", {
        frames: [0, 2, 0, 2, 0, 3, 0, 2],
      }),
      frameRate: 4,
      repeat: -1,
    });

    scene.anims.create({
      key: "covy-walk-right",
      frames: scene.anims.generateFrameNumbers("ss-corona", {
        frames: [4, 6, 4, 6, 4, 7, 4, 6],
      }),
      frameRate: 4,
      repeat: -1,
    });

    scene.anims.create({
      key: "covy-walk-down",
      frames: scene.anims.generateFrameNumbers("ss-corona", {
        frames: [
          12, 14, 12, 14, 12, 19, 12, 14, 12, 15, 12, 14, 12, 19, 12, 14,
        ],
      }),
      frameRate: 4,
      repeat: -1,
    });

    scene.anims.create({
      key: "covy-walk-up",
      frames: scene.anims.generateFrameNumbers("ss-corona", {
        frames: [20, 21, 22, 21],
      }),
      frameRate: 4,
      repeat: -1,
    });
  }

  collisionEvent(obj1,obj2){
    (obj1.name=="covy" ? obj1.doMovement() : obj2.doMovement());
  }

  timerEvent() {}

  getNextMove(movs, lastmove) {
    if (Math.floor(Math.random() * 50) && movs.indexOf(lastmove) >= 0) {
      return lastmove;
    }

    return movs[Math.floor(Math.random() * movs.length)];
  }

  getTileIndexByOffset(obj, x, y) {
    var tile = this.layermap.getTileAtWorldXY(obj.x + x, obj.y + y, true);
    return tile.index;
  }

  checkArround() {
    var movs = [];
    const offset = 16;

    if (this.getTileIndexByOffset(this, 0, offset) !== 2) {
      movs.push("down");
    }
    if (this.getTileIndexByOffset(this, 0, -offset) !== 2) {
      movs.push("up");
    }
    if (this.getTileIndexByOffset(this, -offset, 0) !== 2) {
      movs.push("left");
    }
    if (this.getTileIndexByOffset(this, offset, 0) !== 2) {
      movs.push("right");
    }
    return movs;
  }

  doMovement() {
    const velocity = 50;

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    var movs = this.checkArround();

    var nextMove = this.getNextMove(movs, this.lastmove);

    switch (nextMove) {
      case "left":
        this.body.velocity.x = -velocity;
        this.play("covy-walk-left");
        this.lastmove != "left" ? this.play("covy-walk-left") : null;
        break;
      case "right":
        this.body.velocity.x = velocity;
        this.play("covy-walk-right");
        this.lastmove != "right" ? this.play("covy-walk-right") : null;
        break;
      case "down":
        this.body.velocity.y = velocity;
        this.play("covy-walk-down");
        this.lastmove != "down" ? this.play("covy-walk-down") : null;
        break;
      case "up":
        this.body.velocity.y = -velocity;
        this.lastmove != "up" ? this.play("covy-walk-up") : null;
        break;
    }

    this.lastmove = nextMove;

    //console.log(nextMove);
  }
}
