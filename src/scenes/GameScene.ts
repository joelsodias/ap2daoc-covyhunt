import Phaser, { Scene, Scenes, Tilemaps } from "phaser";

import { debugDraw } from "~/utils/debug";
import { createCovyAnims } from "../animations/CovyAnims";
import { createDoctorAnims } from "../animations/DoctorAnims";
import { createVaccineBoxAnims } from "../animations/VaccineBoxAnims";
import { createCoinAnims } from "../animations/CoinAnims";
import { createHeartAnims } from "../animations/HeartAnims";

import "../actors/Covy"; // enable GameObject Registers
import Covy from "../actors/Covy";

import "../actors/Doctor"; // enable GameObject Registers
import Doctor from "../actors/Doctor";

import { sceneEvents } from "../events/EventsCenter";

import VaccineBox from "../items/VaccineBox";
import Coin from "../items/Coin";
import Heart from "../items/Heart";

import { LevelDialogs } from "../dialogs/LevelDialogs";

import "../Components/SpeechBalloonBitmapText"; // enable GameObject Registers
import { SpeechBalloonPosition } from "../Components/SpeechBalloonBitmapText";

export default class GameScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private doctor!: Doctor;

  private injectionGroup!: Phaser.Physics.Arcade.Group;
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private coinGroup!: Phaser.Physics.Arcade.Group;

  private PlayerEnemiesCollider?: Phaser.Physics.Arcade.Collider;

  private map!: Phaser.Tilemaps.Tilemap;

  private currentLevel: integer;
  private coinCount: integer;
  private injectionCount: integer;
  private healthCount: integer;

  private coinSound!: Phaser.Sound.BaseSound;
  private ouchSound!: Phaser.Sound.BaseSound;
  private throwSound!: Phaser.Sound.BaseSound;
  private popSound!: Phaser.Sound.BaseSound;
  private pop2Sound!: Phaser.Sound.BaseSound;
  private openSound!: Phaser.Sound.BaseSound;
  private collect1upSound!: Phaser.Sound.BaseSound;
  private wallCollisionSound!: Phaser.Sound.BaseSound;
  private gameOverSpeechSound!: Phaser.Sound.BaseSound;
  private gameOverMusicSound!: Phaser.Sound.BaseSound;
  private levelCompleteSound!: Phaser.Sound.BaseSound;
  private winSound!: Phaser.Sound.BaseSound;
  private clapsSound!: Phaser.Sound.BaseSound;
  private collectInjectionSound!: Phaser.Sound.BaseSound;


  private imageGameOver!: Phaser.GameObjects.Image;

  private maxLevels: integer = 1;

  private currentDialog: integer = 0;

  private bottomText: Phaser.GameObjects.BitmapText;

  constructor() {
    super("game");
  }

  init(data) {
    this.currentLevel = data.level ?? 1;
    this.coinCount = data.coins ?? 0;
    this.injectionCount = data.injections ?? 0;
    this.healthCount = data.health ?? 5;
    this.maxLevels = data.maxlevels ?? 1;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.input.mouse.disableContextMenu();

    this.scene.run("game-ui", {
      level: this.currentLevel,
      health: this.healthCount,
      coins: this.coinCount,
      injections: this.injectionCount,
    });

    createDoctorAnims(this.anims);
    createCovyAnims(this.anims);
    createVaccineBoxAnims(this.anims);
    createCoinAnims(this.anims);
    createHeartAnims(this.anims);

    this.coinSound = this.sound.add("coin", { loop: false });
    this.ouchSound = this.sound.add("ouch", { loop: false });
    this.throwSound = this.sound.add("throw", { loop: false });
    this.popSound = this.sound.add("pop", { loop: false });
    this.pop2Sound = this.sound.add("pop2", { loop: false });
    this.openSound = this.sound.add("open", { loop: false });
    this.collect1upSound = this.sound.add("1up", { loop: false });
    this.wallCollisionSound = this.sound.add("wall-collision", { loop: false });
    this.gameOverSpeechSound = this.sound.add("game-over-speech", { loop: false });
    this.gameOverMusicSound = this.sound.add("game-over-music", { loop: false });
    this.levelCompleteSound = this.sound.add("level-complete", { loop: false });
    this.winSound = this.sound.add("win", { loop: false });
    this.clapsSound = this.sound.add("claps", { loop: false });
    this.collectInjectionSound = this.sound.add("collect", { loop: false });

    this.map = this.make.tilemap({ key: "map" });
    const map = this.map;

    //const tileset = map.addTilesetImage('map','tiles', 16, 16, 1, 2)
    const tileset = map.addTilesetImage("map-base", "tiles", 16, 16, 0, 0);

    const groundLayer = map.createLayer("Ground", tileset);

    const wallsLayer = map.createLayer("Walls", tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    const gateLayer = map.createLayer("Gate", tileset);
    gateLayer.setCollisionByProperty({ collides: true });

    this.injectionGroup = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 5,
    });

    this.doctor = this.add.doctor(40, 200, "ss-doc");
    this.doctor.setInjectionGroup(this.injectionGroup);
    this.doctor.setInjections(this.injectionCount);
    this.doctor.setCoins(this.coinCount);
    this.doctor.setHealth(this.healthCount);
    this.doctor.onThrowInjection = () => {
      this.throwSound.play();
    };
    this.doctor.onCollectInjection = () => {
      var container = this.add.container(this.doctor.x-20, this.doctor.y - 50)
      var image = this.add.image(0, 0, "ss-pack-01", "injection-black.png");
      image.setScale(3);
      var text = this.add.text(0, 0, 'x 2');
      
      container.add(image)
      container.add(text)
      
      this.openSound.play();

      var tween = this.tweens.add({
            delay:100,
            targets: container,
            x: this.doctor.x-20,
            y: this.doctor.y - 80,
            duration: 3000,
            ease: 'Back',
            alpha: 0,
            //easeParams: easeTypeParams[idx],
            yoyo: false,
            onStart: () => {
              this.collectInjectionSound.play(); 
            },
            onComplete: () =>{

            }
        });
      
    };

    this.cameras.main.startFollow(this.doctor, true);

    const vaccineBoxGroup = this.physics.add.staticGroup({
      classType: VaccineBox,
    });
    const vaccineBoxLayer = map.getObjectLayer("VaccineBox");
    vaccineBoxLayer.objects.forEach((vBoxObj) => {
      vaccineBoxGroup.get(
        vBoxObj.x! + vBoxObj.width! * 0.5,
        vBoxObj.y! - vBoxObj.height! * 0.5,
        "ss-pack-01"
      );
    });

    const heartGroup = this.physics.add.staticGroup({
      classType: Heart,
    });
    const heartLayer = map.getObjectLayer("Hearts");
    heartLayer.objects.forEach((heartObj) => {
      heartGroup.get(
        heartObj.x! + heartObj.width! * 0.5,
        heartObj.y! - heartObj.height! * 0.5,
        "ss-pack-01"
      );
    });

    this.coinGroup = this.physics.add.group({
      classType: Coin,
    });
    const coinsLayer = map.getObjectLayer("Coins");
    coinsLayer.objects.forEach((coinObj) => {
      this.coinGroup.get(
        coinObj.x! + coinObj.width! * 0.5,
        coinObj.y! - coinObj.height! * 0.5,
        "ss-pack-01"
      );
    });

    this.enemyGroup = this.physics.add.group({
      classType: Covy,
      createCallback: (go) => {
        const covyGo = go as Covy;
        covyGo.body.onCollide = true;
      },
    });

    const enemiesLayer = map.getObjectLayer("Enemies");
    enemiesLayer.objects.forEach((enemyObj) => {
      this.enemyGroup.get(
        enemyObj.x! + enemyObj.width! * 0.5,
        enemyObj.y! - enemyObj.height! * 0.5,
        "ss-covy"
      );
    });

    this.physics.add.collider(
      this.doctor,
      wallsLayer,
      this.handlePlayerWallsCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.doctor,
      gateLayer,
      this.handlePlayerGateCollision,
      undefined,
      this
    );
    this.physics.add.collider(this.enemyGroup, wallsLayer);
    this.physics.add.collider(this.enemyGroup, gateLayer);

    this.physics.add.collider(
      this.doctor,
      heartGroup,
      this.handlePlayerHeartCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.doctor,
      vaccineBoxGroup,
      this.handlePlayerVaccineBoxCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.doctor,
      this.coinGroup,
      this.handlePlayerCoinsCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.injectionGroup,
      wallsLayer,
      this.handleInjectionWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.injectionGroup,
      this.enemyGroup,
      this.handleInjectionEnemyCollision,
      undefined,
      this
    );

    this.PlayerEnemiesCollider = this.physics.add.collider(
      this.enemyGroup,
      this.doctor,
      this.handlePlayerEnemiesCollision,
      undefined,
      this
    );

    this.doctor.play("doc-stop-down");

    this.handleDialogs(this.currentLevel, 1);
  }

  handleDialogs(level: number, dialog: number) {
    //var dialog = LevelDialogs[language][level][dialog];
    console.log(LevelDialogs["pt-BR"]);
    console.log(LevelDialogs["pt-BR"]["level-" + dialog.toString()]);

    var closeDialog = false;
    var languageKey = "pt-BR";
    var levelKey = "level-" + level.toString();
    var dialogKey = "dialog-" + dialog.toString();

    this.physics.pause();

    if (LevelDialogs[languageKey] !== undefined) {
      if (LevelDialogs[languageKey][levelKey] !== undefined) {
        if (LevelDialogs[languageKey][levelKey][dialogKey] !== undefined) {
          if (!this.bottomText) {
            this.bottomText = this.add
              .bitmapText(
                this.doctor.x,
                this.doctor.y + 100,
                "atari",
                "Clique para continuar..",
                16
              )
              .setOrigin(0.5)
              .setCenterAlign()
              .setInteractive()
              .setTint(0, 0, 0, 0);
          }

          this.doctor.sayMessage(
            SpeechBalloonPosition.LEFT,
            LevelDialogs[languageKey][levelKey][dialogKey]
          );

          this.input.on("pointerdown", () => {
            this.currentDialog = dialog + 1;
            this.handleDialogs(level, this.currentDialog);
          });
        } else {
          closeDialog = true;
        }
      } else {
        closeDialog = true;
      }
    } else {
      closeDialog = true;
    }

    if (closeDialog) {
      this.doctor.closeMessage();
      this.physics.resume();
      this.bottomText.destroy();
      this.input.removeAllListeners();
    }
  }

  handleGameOver(win: boolean) {
    //if (this.doctor.health <= 0) {

    if (win) {
      this.imageGameOver = this.add.image(
        this.doctor.x,
        this.doctor.y,
        "game-over-win"
      );

      this.doctor.setWinner();

      this.winSound.play();
      this.clapsSound.play();

    } else {
      this.imageGameOver = this.add.image(
        this.doctor.x,
        this.doctor.y,
        "game-over-fail"
      );
      this.gameOverSpeechSound.play();
      this.gameOverMusicSound.play();

    }

    const text = this.add
      .bitmapText(
        this.doctor.x * 0.5,
        this.doctor.y + 200,
        "atari",
        "Clique para continuar..",
        16
      )
      .setOrigin(0.5)
      .setCenterAlign()
      .setInteractive()
      .setTint(0, 0, 0, 0);

    this.PlayerEnemiesCollider?.destroy();
    this.physics.pause();

    localStorage.setItem("currentRanking", this.doctor.getCoins().toString());

    //    this.input.on("pointerdown", this.handleCloseGame);
    this.input.on("pointerdown", () => {
      this.handleCloseGame(this);
    });
  }

  handleCloseGame(scene: GameScene) {
    scene.input.removeListener("pointerdown", this.handleCloseGame);
    scene.imageGameOver.destroy();
    var gameWrapper = document.getElementById("phaser-game-wrapper");
    gameWrapper.style.display = "none";
    var addRanking = document.getElementById("addRanking");
    addRanking.style.display = "block";

    var spPontos = document.getElementById("spPontos") as HTMLSpanElement;
    spPontos.innerText = this.doctor.getCoins().toString();

    scene.scene.start("preloader", { level: 1, coins: 0, injections: 0 });
  }

  private handlePlayerWallsCollision() {
    //this.wallCollisionSound.play();
  }

  private handlePlayerGateCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    if (this.maxLevels >= this.currentLevel + 1) {
      this.scene.start("preloader", {
        level: this.currentLevel + 1,
        health: this.doctor.getHealth(),
        coins: this.doctor.getCoins(),
        injections: this.doctor.getInjections(),
      });
      this.levelCompleteSound.play();
    } else {
      this.handleGameOver(true);
    }
  }

  private handlePlayerHeartCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.destroy();
    var doc = obj1 as Doctor;
    doc.collectHealth(1);
    this.collect1upSound.play();
  }

  private handlePlayerCoinsCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.destroy();
    var doc = obj1 as Doctor;
    doc.collectCoin(1);
    this.coinSound.play();
  }

  private handlePlayerVaccineBoxCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const box = obj2 as VaccineBox;
    this.doctor.setVaccineBox(box);
  }

  private handleInjectionWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.injectionGroup.killAndHide(obj1);
    obj1.destroy();
    this.pop2Sound.play();
  }

  private handleInjectionEnemyCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.injectionGroup.killAndHide(obj1);
    this.enemyGroup.killAndHide(obj2);
    obj1.destroy();
    obj2.destroy();
    this.popSound.play();
  }

  private handlePlayerEnemiesCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const covy = obj2 as Covy;

    const dx = this.doctor.x - covy.x;
    const dy = this.doctor.y - covy.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.ouchSound.play();

    this.doctor.handleHURT(dir);

    sceneEvents.emit("player-health-changed", this.doctor.health);
  }

  update(t: number, dt: number) {
    if (this.doctor) {
      this.doctor.update(this.cursors);
    }
  }
}
