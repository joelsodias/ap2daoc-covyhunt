
import Phaser from "phaser";
import Covy from "~/actors/Covy";

export class MainScene extends Phaser.Scene {

  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private layer!: Phaser.Tilemaps.TilemapLayer;
  private player!: Phaser.Physics.Arcade.Sprite;
  private covy!: Covy;
  private lastPlayerMove!: String;


  constructor() {
    super("game");
  }

  preload() {
    // this.load.spritesheet("ss-doc", "assets/sprites/doc-sheet-32x32.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });

    // this.load.spritesheet("ss-corona", "assets/sprites/covid-sheet-32x32.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });

    // this.load.image("tiles", "./assets/tilemaps/tiles/drawtiles-spaced.png");
    // //this.load.image("car", "./assets/sprites/car90.png");
    // //this.load.image("corona", "./assets/sprites/corona.ico");
    // this.load.tilemapCSV("map", "./assets/tilemaps/csv/mapa1.csv");
    // //this.load.tilemapTiledJSON("map", "./assets/tilemaps/json/map1.json");
  }

  create() {
    this.map = this.make.tilemap({
      key: "map",
      tileWidth: 34,
      tileHeight: 34,
    });

    //this.tileset = this.map.addTilesetImage("tiles", null, 34, 34, 1, 2);
    this.tileset = this.map.addTilesetImage("tiles", null, 34, 34);
    this.layer = this.map.createLayer(0, this.tileset, 0, 0);

    // this.player = this.add.image(32 + 16, 32 + 16, "corona");
    this.player = this.physics.add.sprite(32 + 16, 32 + 16, "doc");
    this.player.name = "doc";

    this.covy = new CovyActor({scene:this, tileX:4, tileY:1, layermap:this.layer})
    // this.covy2 = new Covy({scene:this, x:200 + 16, y:200 + 16, layermap:this.layer})
    // this.covy3 = new Covy({scene:this, x:400 + 16, y:400 + 16, layermap:this.layer})
    // this.covy4 = new Covy({scene:this, x:600 + 16, y:400 + 16, layermap:this.layer})

    // this.covy = this.physics.add.sprite(32 + 16, 32 + 16, "covy");
    // this.covy.name = "covy";

    this.physics.add.collider(this.player, this.layer, this.collisionTrigger);
    //this.physics.add.collider(this.covy, this.layer, this.collisionTrigger);
    this.layer.setCollisionBetween(1, 2);

    this.setDocAnims();
    //this.setCovyAnims();

    this.player.play("doc-stop-right");
    this.lastPlayerMove = "doc-stop-right";

    // this.covy.play("covy-walk-up");
    // this.covy.lastmove = null;

    const pm = this.playerMovement2;
    this.input.keyboard.on("keydown", pm);
    this.input.keyboard.on("keyup", pm);

    // const enemies = this.physics.add.group();
    // enemies.create(32+16, 32+16 , "enemy");

    this.timedEvent = this.time.addEvent({
      delay: 50,
      callback: this.moveEnemy,
      callbackScope: this,
      loop: true,
    });
    //this.moveEnemy(this.covy);
  }

  
  setDocAnims() {
    
  }

  playerMovement2(event) {
    //console.log("keydown-arguments:", arguments);
    //console.log("keydown-event:", event);

    if (event.type == "keyup") {
      this.scene.player.body.velocity.x = 0;
      this.scene.player.body.velocity.y = 0;

      switch (this.scene.player.lastmove) {
        case "doc-walk-left":
          this.scene.player.play("doc-stop-left");
          this.scene.player.lastmove = "doc-stop-left";
          break;
        case "doc-walk-right":
          this.scene.player.play("doc-stop-right");
          this.scene.player.lastmove = "doc-stop-right";
          break;
        case "doc-walk-down":
          this.scene.player.play("doc-stop-down");
          this.scene.player.lastmove = "doc-stop-down";
          break;
        case "doc-walk-up":
          this.scene.player.play("doc-stop-up");
          this.scene.player.lastmove = "doc-stop-up";
          break;
      }
    } else if (event.type == "keydown") {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
          this.scene.player.body.velocity.x = -300;
          if (this.scene.player.lastmove !== "doc-walk-left") {
            this.scene.player.play("doc-walk-left");
            this.scene.player.lastmove = "doc-walk-left";
          }
          //player.angle = 180;
          break;

        case "ArrowRight":
        case "d":
          this.scene.player.body.velocity.x = 300;
          if (this.scene.player.lastmove !== "doc-walk-right") {
            this.scene.player.play("doc-walk-right");
            this.scene.player.lastmove = "doc-walk-right";
          } //player.angle = 0;

          break;

        case "ArrowDown":
        case "s":
          this.scene.player.body.velocity.y = 300;

          if (this.scene.player.lastmove !== "doc-walk-down") {
            this.scene.player.play("doc-walk-down");
            this.scene.player.lastmove = "doc-walk-down";
          }
          //player.angle = 90;

          break;
        case "ArrowUp":
        case "w":
          this.scene.player.body.velocity.y = -300;
          if (this.scene.player.lastmove !== "doc-walk-up") {
            this.scene.player.play("doc-walk-up");
            this.scene.player.lastmove = "doc-walk-up";
          }
          //player.angle = -90;

          break;
      }
    }
  }

  




  collisionTrigger(obj1, obj2) {
    console.log(obj1, "colidiu com", obj2);
    if (obj1.name == "covy") {
      console.log(this);
      obj1.scene.moveEnemy(obj1);
    }
  }

  

  update() {

  }
}

export default MainScene;
