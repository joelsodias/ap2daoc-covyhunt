
import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.spritesheet("ss-doc", "sprites/doc-sheet-32x32.png", {
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
      key:"ss-pack-01",
      textureURL:"items/item-pack-01.png",
      atlasURL:"items/item-pack-01.json"
    }
    );

    
    this.load.image("tiles", "tilemaps/map-01/map-01_tiles_extruded.png");

    this.load.tilemapTiledJSON("map-01", "tilemaps/map-01/map-01-teste.json");

    
  }

  create() {
    this.scene.start("game");
  }
}
