import Phaser from "phaser";

import { sceneEvents } from "../events/EventsCenter";

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;
  private injectionsLabel!: Phaser.GameObjects.Text;
  private coinsLabel!: Phaser.GameObjects.Text;
  private levelLabel!: Phaser.GameObjects.Text;

  private currentLevel: integer;
  private coinCount: integer;
  private injectionCount: integer;
  private healthCount: integer;

  constructor() {
    super({ key: "game-ui" });
  }

  init(data) {
    this.currentLevel = data.level ?? 1;
    this.coinCount = data.coins ?? 0;
    this.injectionCount = data.injections ?? 0;
    this.healthCount = data.health ?? 5;
  }

  create() {
    



    this.add.image(100, 13, "ss-pack-01", "injection-black.png");
    this.injectionsLabel = this.add.text(
      120,
      6,
      this.injectionCount.toString(),
      {
        fontSize: "14",
      }
    );

    this.add.image(155, 8, "ss-pack-01", "coin_anim_f0.png");
    this.coinsLabel = this.add.text(165, 6, this.coinCount.toString(), {
      fontSize: "14",
    });

    this.levelLabel = this.add.text(
      210,
      6,
      "Nivel: " + this.currentLevel.toString(),
      {
        fontSize: "14",
      }
    );

    this.add.image(180, 8, "ss-tiles", 7);

    sceneEvents.on("player-coins-changed", (coins: number) => {
      this.coinsLabel.text = coins.toLocaleString();
    });

    sceneEvents.on("player-injections-changed", (injections: number) => {
      this.injectionsLabel.text = injections.toLocaleString();
    });

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this.hearts.createMultiple({
      key: "ui-heart-full",
      setXY: {
        x: 10,
        y: 10,
        stepX: 16,
      },
      quantity: 5,
    });

    this.handlePlayerHealthChanged(this.healthCount);

    sceneEvents.on(
      "player-health-changed",
      this.handlePlayerHealthChanged,
      this
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        "player-health-changed",
        this.handlePlayerHealthChanged,
        this
      );
      sceneEvents.off("player-coins-changed");
    });
  }

  private handlePlayerHealthChanged(health: number) {
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image;
      if (idx < health) {
        heart.setTexture("ui-heart-full");
      } else {
        heart.setTexture("ui-heart-empty");
      }
    });
  }
}
