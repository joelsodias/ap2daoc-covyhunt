import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  private levelToLoad = 0;
  private coinCount: integer;
  private injectionCount: integer;
  private healthCount: integer;
  private maxLevels: integer;

  constructor() {
    super("preloader");
  }

  init(data) {
    console.log(data);
    this.levelToLoad = data.level ?? 1;
    this.coinCount = data.coins ?? 0;
    this.injectionCount = data.injections ?? 0;
    this.healthCount = data.health ?? 5;
    this.maxLevels = data.maxlevels ?? 5;
  }

  preload() {
    this.load.audio("coin", "sound/coin.mp3");
    this.load.audio("ouch", "sound/ouch.mp3");
    this.load.audio("throw", "sound/throw.mp3");
    this.load.audio("pop", "sound/pop.mp3");
    this.load.audio("pop2", "sound/pop2.mp3");
    this.load.audio("open", "sound/open.mp3");
    this.load.audio("1up", "sound/collect-1up.mp3");
    this.load.audio("wall-collision", "sound/wall-collision.mp3");
    this.load.audio("level-complete", "sound/level-complete.mp3");
    this.load.audio("claps", "sound/claps.mp3");
    this.load.audio("level-complete", "sound/level-complete.mp3");
    this.load.audio("game-over-speech", "sound/game-over-speech.mp3");
    this.load.audio("game-over-music", "sound/game-over-music.mp3");
    this.load.audio("level-complete", "sound/level-complete.mp3");
    this.load.audio("win", "sound/win.mp3");

    this.load.bitmapFont('atari', 'fonts/bitmap/gem.png', 'fonts/bitmap/gem.xml');
    this.load.bitmapFont('nokia16', 'fonts/bitmap/nokia16.png', 'fonts/bitmap/nokia16.xml');

    this.load.image("game-over-fail", "images/gameover.png");
    this.load.image("game-over-win", "images/win.png");

    this.load.image("tiles", "tilemaps/map-base.png");

    
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
