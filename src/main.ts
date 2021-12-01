import Phaser from "phaser";

import GameScene from './scenes/GameScene';
import Preloader from "./scenes/Preloader";
import GameUI from "./scenes/GameUI";

const config = {
  type: Phaser.AUTO,
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 800,
  height: 600,
  parent: "phaser-game",
  pixelArt: true,
  backgroundColor: "#aaa",
  //    backgroundColor: "#1a1a2d",
  scene: [Preloader, GameScene, GameUI],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scale: {
    zoom: 1.5,
  },
};

const game = new Phaser.Game(config);
let maingame = game;

window.onload = function () {
  var btnShow = document.getElementById("btnShow");
  var phaserGame = document.getElementById("phaser-game");

  btnShow!.onclick = function () {
    var mainCanvas = phaserGame!.children[0] as HTMLCanvasElement;
    var divRank = document.getElementById("divRank");

    if (divRank !== undefined) {
      
      divRank.classList.remove("hidden");
      divRank.classList.add("visible");
      divRank.style.left = Math.floor(mainCanvas.width * 0.2).toString() + "px";
      divRank.style.top = Math.floor(mainCanvas.height * 0.2 + mainCanvas.clientTop).toString() + "px";
      divRank.style.width =
        Math.floor(mainCanvas.width * 0.8).toString() + "px";
      divRank.style.height =
        Math.floor(mainCanvas.height * 0.8).toString() + "px";

      console.log(divRank);
    }
  };
};
