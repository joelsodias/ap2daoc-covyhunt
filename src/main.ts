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
  
  var gameWrapper = document.getElementById("phaser-game-wrapper");
  gameWrapper.style.display="none"

  var btnTeste = document.getElementById("btnTeste");

  btnTeste!.onclick = function () {
    //var mainCanvas = phaserGame!.children[0] as HTMLCanvasElement;
    var gameWrapper = document.getElementById("phaser-game-wrapper");
    
    var divMenu = document.getElementById("divMenu");
      
      divMenu.style.display="none"
      gameWrapper.style.display="block"

  };

  var btnTeste2 = document.getElementById("btnTeste2");

  btnTeste2!.onclick = function () {
    //var mainCanvas = phaserGame!.children[0] as HTMLCanvasElement;

    goRank()

  };


};

export function goRank(): void {
  // your code

  var gameWrapper = document.getElementById("phaser-game-wrapper");
  gameWrapper.style.display="none"
  var divRank = document.getElementById("divRank");
  divRank.style.display="block"

}
