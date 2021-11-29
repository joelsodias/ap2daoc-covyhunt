
import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  
  
  preload() {
  
    this.load.image("tiles", "tilemaps/map-base.png");
    this.load.tilemapTiledJSON({
      key: 'map',
      url: 'tilemaps/map-novo-03.json'
    });
  
    this.load.spritesheet("ss-tiles", "tilemaps/map-base.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

  
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
      textureURL:"items/item-pack-01v2.png",
      atlasURL:"items/item-pack-01v2.json"
    }
    );

    //this.load.image('injection-black', 'injection-black.png');

    
    
    
  }

  create() {
    this.scene.start("game");
  }
}
