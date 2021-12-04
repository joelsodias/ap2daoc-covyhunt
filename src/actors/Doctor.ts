import Phaser, { Game } from "phaser";
import VaccineBox from "../items/VaccineBox";
import GameScene from "../scenes/GameScene";

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
  WINNER,
}

export default class Doctor extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.STOPED;
  private HURTTime = 0;

  private healthCount: integer;
  private coinCount: integer;
  private injectionCount: integer;

  private injectionGroup?: Phaser.Physics.Arcade.Group;
  private activeVaccineBox?: VaccineBox;

  private gameScene: GameScene;

  private currentMessageObj: Phaser.GameObjects.BitmapText;
  private currentMessageBubble: Phaser.GameObjects.Graphics;



  get health() {
    return this.healthCount;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.gameScene = scene as GameScene;

    this.anims.play("doc-stop-down");
    //sceneEvents.emit("player-injections-changed", this.injectionCount);
  }

  closeMessage() {
    if (this.currentMessageObj) {this.currentMessageObj.destroy()}
    if (this.currentMessageBubble) {this.currentMessageBubble.destroy()}
  }

  sayMessage(
    x: number,
    y: number,
    message: string[]
  ) {

    
    

    const fontSize = 16
    const fontName = "atari"

    if (this.currentMessageObj) {this.currentMessageObj.destroy()}
    if (this.currentMessageBubble) {this.currentMessageBubble.destroy()}

    this.currentMessageObj = this.scene.add
      .bitmapText(x + 10, y + 10, fontName, message, fontSize)
      //.setOrigin(0.5)
      //.setCenterAlign()
      .setInteractive()
      .setTint(0, 0, 0, 0);

    var bubbleWidth = this.currentMessageObj.width + 20;
    var bubbleHeight = this.currentMessageObj.height + 20;
    var bubblePadding = 10;
    var arrowHeight = bubbleHeight / 4;


    this.currentMessageObj.destroy();

    this.currentMessageBubble = this.scene.add.graphics({ x: x, y: y });

    //  this.currentMessageBubble shadow
    this.currentMessageBubble.fillStyle(0x222222, 0.5);
    this.currentMessageBubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    // this.currentMessageBubble color
    this.currentMessageBubble.fillStyle(0xffffff, 1);
    
    //  this.currentMessageBubble outline line style
    this.currentMessageBubble.lineStyle(4, 0x565656, 1);
    
    // //  this.currentMessageBubble shape and outline
    this.currentMessageBubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    this.currentMessageBubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    
    //  Calculate arrow coordinates
    var point1X = Math.floor(bubbleWidth / 7);
    var point1Y = bubbleHeight;
    var point2X = Math.floor((bubbleWidth / 7) * 2);
    var point2Y = bubbleHeight;
    var point3X = Math.floor(bubbleWidth / 7);
    var point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  this.currentMessageBubble arrow shadow
    this.currentMessageBubble.lineStyle(4, 0x222222, 0.5);
    this.currentMessageBubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  this.currentMessageBubble arrow fill
    this.currentMessageBubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    this.currentMessageBubble.lineStyle(2, 0x565656, 1);
    this.currentMessageBubble.lineBetween(point2X, point2Y, point3X, point3Y);
    this.currentMessageBubble.lineBetween(point1X, point1Y, point3X, point3Y);
    
    this.currentMessageObj = this.scene.add
    .bitmapText(x + 10, y + 10, fontName, message, fontSize)
    //.setOrigin(0.5)
      .setCenterAlign()
      .setInteractive()
      .setTint(0, 0, 0, 0);

    //  this.currentMessageBubble outline line style
    this.currentMessageBubble.lineStyle(1, 0x0, 1);
    
    // this.currentMessageBubble.lineStyle(3, 0x0, 1);
    // this.currentMessageBubble.strokeCircle(bubbleWidth+5, bubbleHeight+5, 20)
    // this.currentMessageBubble.fillStyle(0xffffff, 1);
    // this.currentMessageBubble.fillCircle(bubbleWidth+5, bubbleHeight+5, 20)

    // this.currentMessageObj = this.scene.add
    // .bitmapText(x+bubbleWidth-2, y+bubbleHeight-2, fontName, "OK", fontSize)
    // //.setOrigin(0.5)
    // .setCenterAlign()
    // .setInteractive()
    // .setTint(0, 0, 0, 0);
    
    //var b = this.currentMessageObj.getBounds();

    // this.currentMessageObj.setPosition(
    //   this.currentMessageBubble.x + bubbleWidth / 2 - this.currentMessageObj. width / 2,
    //   this.currentMessageBubble.y + bubbleHeight / 2 - this.currentMessageObj.height / 2
    // );

    //var button = this.scene.game.dd. button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
  }

  setGameScene(scene: GameScene) {
    this.gameScene = scene;
  }

  setInjectionGroup(injectionGroup: Phaser.Physics.Arcade.Group) {
    this.injectionGroup = injectionGroup;
  }

  setVaccineBox(VaccineBox: VaccineBox) {
    this.activeVaccineBox = VaccineBox;
  }

  handleHURT(dir: Phaser.Math.Vector2) {
    if (this.healthCount <= 0) {
      return;
    }

    if (this.healthState === HealthState.HURT) {
      return;
    }

    --this.healthCount;

    if (this.healthCount <= 0) {
      // TODO: die
      this.healthState = HealthState.DEAD;
      this.anims.play("doc-stop-fail");
      this.setVelocity(0, 0);
      this.gameScene.handleGameOver(false);
    } else {
      this.setVelocity(dir.x, dir.y);

      this.setTint(0xff0000);

      this.healthState = HealthState.HURT;
      this.HURTTime = 0;
    }
  }

  setWinner() {
    this.healthState = HealthState.WINNER;
    this.anims.play("doc-stop-success");
    this.setVelocity(0, 0);
  }

  collectCoin(quantity: integer) {
    this.coinCount += quantity;
    sceneEvents.emit("player-coins-changed", this.coinCount);
  }

  collectInjection(quantity: integer) {
    this.injectionCount += quantity;
    sceneEvents.emit("player-injections-changed", this.injectionCount);
  }

  collectHealth(quantity: integer) {
    if (this.healthCount + quantity <= 5) {
      this.healthCount += quantity;
      sceneEvents.emit("player-health-changed", this.healthCount);
    }
  }

  private throwInjection() {
    var oldX,
      oldY,
      oldBodyX,
      oldBodyY = 0;

    if (!this.injectionGroup || this.injectionCount < 1) {
      return;
    }

    const injection = this.injectionGroup.get(
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

    this.injectionCount -= 1;

    sceneEvents.emit("player-injections-changed", this.injectionCount);
    if (this.injectionCount <= 0) {
      this.play(this.anims.currentAnim.key.replace("-injection", ""));
    }
  }

  getHealth() {
    return this.healthCount;
  }

  setHealth(value: integer) {
    this.healthCount = value;
  }

  getCoins() {
    return this.coinCount;
  }

  setCoins(value: integer) {
    this.coinCount = value;
  }

  getInjections() {
    return this.injectionCount;
  }

  setInjections(value: integer) {
    this.injectionCount = value;
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
      this.healthState === HealthState.DEAD ||
      this.healthState === HealthState.WINNER
    ) {
      return;
    }

    if (!cursors) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
      if (this.activeVaccineBox) {
        if (
          this.activeVaccineBox.anims.currentAnim.key === "vaccine-box-full"
        ) {
          const coins = this.activeVaccineBox.open();

          this.collectInjection(2);

          //sceneEvents.emit("player-injections-changed", this.injectionCount);
        }
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
    var postfix = "";

    if (this.injectionCount > 0) {
      postfix = "-injection";
    }

    if (leftDown) {
      this.anims.play("doc-walk-left" + postfix, true);
      this.setVelocity(-speed, 0);

      //this.scaleX = -1
      this.body.offset.x = 8;
    } else if (rightDown) {
      this.anims.play("doc-walk-right" + postfix, true);
      this.setVelocity(speed, 0);

      //this.scaleX = 1
      this.body.offset.x = 8;
    } else if (upDown) {
      this.anims.play("doc-walk-up" + postfix, true);
      this.setVelocity(0, -speed);
    } else if (downDown) {
      this.anims.play("doc-walk-down" + postfix, true);
      this.setVelocity(0, speed);
    } else {
      var currentAnim = this.anims.currentAnim.key;
      const parts = currentAnim.split("-");
      parts[1] = "stop";

      if (parts[2] == "success" || parts[2] == "fail") {
        postfix = "";
      }

      var newAnim = parts.join("-");
      if (newAnim !== currentAnim) {
        this.anims.play(parts.join("-"));
      }
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
