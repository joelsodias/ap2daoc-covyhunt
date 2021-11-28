import Phaser from "phaser";

import Game from "./scenes/Game";
import Preloader from "./scenes/Preloader";
import GameUI from "./scenes/GameUI";

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    parent: "phaser-game",
    pixelArt: true,
    backgroundColor: "#1a1a2d",
    scene: [Preloader, Game, GameUI],
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
        gravity: { y: 0 },
      },
    },
    scale: {
      zoom: 2
    }
  };

  const game = new Phaser.Game(config);