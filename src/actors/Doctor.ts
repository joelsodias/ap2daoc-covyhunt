import Phaser from "phaser";
import VaccineBox from "../items/VaccineBox";

import { sceneEvents } from "../events/EventsCenter";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      doctor(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Doctor;
    }
  }
}

enum HealthState {
  STOPED,
  HURT,
  DEAD,
}

export default class Doctor extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.STOPED;
  private HURTTime = 0;

  private _health = 5;
  private _coins = 0;
  private _injections = 2;

  private injections?: Phaser.Physics.Arcade.Group;
  private activeVaccineBox?: VaccineBox;

  get health() {
    return this._health;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("doc-stop-down");
  }

  setinjections(injections: Phaser.Physics.Arcade.Group) {
    this.injections = injections;
  }

  setVaccineBox(VaccineBox: VaccineBox) {
    this.activeVaccineBox = VaccineBox;
  }

  handleHURT(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return;
    }

    if (this.healthState === HealthState.HURT) {
      return;
    }

    --this._health;

    if (this._health <= 0) {
      // TODO: die
      this.healthState = HealthState.DEAD;
      this.anims.play("doc-angry");
      this.setVelocity(0, 0);
    } else {
      this.setVelocity(dir.x, dir.y);

      this.setTint(0xff0000);

      this.healthState = HealthState.HURT;
      this.HURTTime = 0;
    }
  }

  collectCoin(quantity: integer) {
    this._coins += quantity;
    sceneEvents.emit("player-coins-changed", this._coins);
  }

  collectInjection(quantity: integer) {
    this._injections += quantity;
    sceneEvents.emit("player-injections-changed", this._injections);
  }

  collectHealth(quantity: integer) {
    this._health += quantity;
    sceneEvents.emit("player-health-changed", this._health);
  }

  private throwInjection() {
    var oldX,
      oldY,
      oldBodyX,
      oldBodyY = 0;

    if ((!this.injections) || (this._injections < 1)) {
      return;
    }

    const injection = this.injections.get(
      this.x,
      this.y,
      "ss-pack-01",
      "injection-black.png"
    ) as Phaser.Physics.Arcade.Sprite;

    if (!injection) {
      return;
    }

    injection.setActive(true);
    injection.setVisible(true);

    const parts = this.anims.currentAnim.key.split("-");
    const direction = parts[2];

    const vec = new Phaser.Math.Vector2(0, 0);

    switch (direction) {
      case "up":
        vec.y = -1;
        injection.body.setSize(5, 15, true);
        injection.body.offset.y = -5;
        injection.body.offset.x = -5;
        break;

      case "down":
        vec.y = 1;
        injection.body.setSize(5, 15, true);
        injection.body.offset.y = 5;
        injection.body.offset.x = 5;
        break;

      case "left":
        vec.x = -1;
        injection.body.setSize(15, 5, true);
        injection.body.offset.y = 10;
        injection.body.offset.x = -10;
        break;

      case "right":
        vec.x = 1;
        injection.body.setSize(15, 5, true);
        injection.body.offset.y = 0;
        injection.body.offset.x = 0;
        break;
    }

    const angle = vec.angle();

    injection.setActive(true);
    injection.setVisible(true);

    injection.setRotation(angle);

    oldX = injection.x;
    oldY = injection.y;
    oldBodyX = injection.body.x;
    oldBodyY = injection.body.y;

    injection.x += vec.x * 16;
    injection.y += vec.y * 16;

    injection.setVelocity(vec.x * 100, vec.y * 100);

    injection.body.x = injection.x;
    injection.body.y = injection.y;

    this._injections -= 1;

    sceneEvents.emit("player-injections-changed", this._injections)

  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.STOPED:
        break;

      case HealthState.HURT:
        this.HURTTime += dt;
        if (this.HURTTime >= 250) {
          this.healthState = HealthState.STOPED;
          this.setTint(0xffffff);
          this.HURTTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (
      this.healthState === HealthState.HURT ||
      this.healthState === HealthState.DEAD
    ) {
      return;
    }

    if (!cursors) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
      if (this.activeVaccineBox) {
        const coins = this.activeVaccineBox.open();

        this._injections += 2;
        sceneEvents.emit("player-injections-changed", this._injections);
      } else {
        this.throwInjection();
      }
      return;
    }

    const speed = 100;

    const leftDown = cursors.left?.isDown;
    const rightDown = cursors.right?.isDown;
    const upDown = cursors.up?.isDown;
    const downDown = cursors.down?.isDown;

    if (leftDown) {
      this.anims.play("doc-walk-left", true);
      this.setVelocity(-speed, 0);

      //this.scaleX = -1
      this.body.offset.x = 8;
    } else if (rightDown) {
      this.anims.play("doc-walk-right", true);
      this.setVelocity(speed, 0);

      //this.scaleX = 1
      this.body.offset.x = 8;
    } else if (upDown) {
      this.anims.play("doc-walk-up", true);
      this.setVelocity(0, -speed);
    } else if (downDown) {
      this.anims.play("doc-walk-down", true);
      this.setVelocity(0, speed);
    } else {
      const parts = this.anims.currentAnim.key.split("-");
      parts[1] = "stop";
      this.anims.play(parts.join("-"));
      this.setVelocity(0, 0);
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeVaccineBox = undefined;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "doctor",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new Doctor(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    //sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)
    sprite.body.setSize(sprite.width * 0.5, sprite.height);

    return sprite;
  }
);
