import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  private levelToLoad = 0;
  private coinCount: integer;
  private injectionCount: integer;
  private healthCount: integer;
  private maxLevels: integer = 1;

  constructor() {
    super("preloader");
  }

  init(data) {
    console.log(data);
    this.levelToLoad = data.level ?? 1;
    this.coinCount = data.coins ?? 0;
    this.injectionCount = data.injections ?? 2;
    this.healthCount = data.health ?? 5;
  }

  preload() {
    this.load.audio("coin", "sound/coin.mp3");

    this.load.image("game-over-fail", "images/gameover.png");
    this.load.image("game-over-win", "images/win.png");

    this.load.image("tiles", "tilemaps/map-base.png");

    this.maxLevels = 5;
    var levelUrl = "tilemaps/level-" + this.levelToLoad.toString() + ".json";

    this.cache.tilemap.remove("map");
    this.load.tilemapTiledJSON({
      key: "map",
      url: levelUrl,
    });

    this.load.spritesheet("ss-tiles", "tilemaps/map-base.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("ss-doc", "sprites/doc-sheet-v2-32x32.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("ss-corona", "sprites/covid-sheet-32x32.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image("ui-heart-empty", "ui/ui_heart_empty.png");
    this.load.image("ui-heart-full", "ui/ui_heart_full.png");

    this.load.atlas({
      key: "ss-pack-01",
      textureURL: "items/item-pack-01v2.png",
      atlasURL: "items/item-pack-01v2.json",
    });
  }

  create() {
    this.scene.start("game", {
      maxlevels: this.maxLevels,
      level: this.levelToLoad,
      health: this.healthCount,
      coins: this.coinCount,
      injections: this.injectionCount,
    });
  }
}
