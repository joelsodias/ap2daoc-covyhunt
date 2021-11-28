import Phaser from "phaser";

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3);
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }

  return newDirection;
};

export default class Covy extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;
  private moveEvent: Phaser.Time.TimerEvent;
  private lastDirection = this.direction;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("covy-stop-left");

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  destroy(fromScene?: boolean) {
    this.moveEvent.destroy();

    super.destroy(fromScene);
  }

  private handleTileCollision(
    go: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ) {
    if (go !== this) {
      return;
    }

    this.direction = randomDirection(this.direction);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    const speed = 50;

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed);
        if (this.lastDirection !== this.direction) {
          this.play("covy-walk-up");
        }
        break;

      case Direction.DOWN:
        this.setVelocity(0, speed);
        if (this.lastDirection !== this.direction) {
          this.play("covy-walk-down");
        }
        break;

      case Direction.LEFT:
        this.setVelocity(-speed, 0);
        if (this.lastDirection !== this.direction) {
          this.play("covy-walk-left");
        }
        break;

      case Direction.RIGHT:
        this.setVelocity(speed, 0);
        if (this.lastDirection !== this.direction) {
          this.play("covy-walk-right");
        }
        break;
    }
	this.lastDirection = this.direction;
  }
}
