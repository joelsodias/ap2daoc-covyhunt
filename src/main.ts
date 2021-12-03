import Phaser from "phaser";

import GameScene from "./scenes/GameScene";
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

var game = new Phaser.Game(config);
let maingame = game;

window.onload = function () {
  var divMenu = document.getElementById("divMenu");
  var btnJogar = document.getElementById("btnJogar");
  var phaserGame = document.getElementById("phaser-game-wrapper");
  var rankingButton = document.getElementById("rankingButton");
  var voltarButton = document.getElementById("buttonBack");
  var cancelar = document.getElementById("btCancel");
  var btConfirm = document.getElementById("btConfirm");
  var formRanking = document.getElementById("formRanking");
  var btConfirm = document.getElementById("btConfirm");
  var divRanking = document.getElementById("divRanking");

  
  phaserGame.style.display = "none";
  divRanking.style.display = "none";
  divMenu.style.display = "block";


  btnJogar!.onclick = function () {
    var divMenu = document.getElementById("divMenu");
    var wrapper = document.getElementById("phaser-game-wrapper");
      divMenu.style.display = "none";
      wrapper.classList.remove("hidden");
      wrapper.style.display = "block";
      //game.destroy(true);
      //game = new Phaser.Game(config);
      
  
  };

  rankingButton!.onclick = function () {
    var divMenu = document.getElementById("divMenu");
    var ranking = document.getElementById("divRanking");

    if (divMenu !== undefined) {
      divMenu.style.display = "none";
      ranking.classList.remove("hidden");
      ranking.style.display = "block";
    }
  };

  voltarButton!.onclick = function () {
    var divMenu = document.getElementById("divMenu");
    var ranking = document.getElementById("divRanking");

    if (ranking !== undefined) {
      ranking.style.display = "none";
      divMenu.classList.remove("hidden");
      divMenu.style.display = "block";
    }
  };

  cancelar!.onclick = function () {
    var divMenu = document.getElementById("divMenu");
    var addRanking = document.getElementById("addRanking");

    if (addRanking !== undefined) {
      addRanking.style.display = "none";
      divMenu.classList.remove("hidden");
      divMenu.style.display = "block";
    }
  };

  btConfirm!.onclick = function () {
    var addRanking = document.getElementById("addRanking");
    var ranking = document.getElementById("divRanking");
    

    if (addRanking !== undefined) {
      addRanking.style.display = "none";
      ranking.classList.remove("hidden");
      ranking.style.display = "block";
    }
  };

  formRanking!.onsubmit = function () {

    console.log("submit")
    return false;
  };

  

  btConfirm!.onclick = function () {

    var nomeField = document.getElementById("nomes") as HTMLInputElement
    

    console.log("funfou")
    
    let ranking = new Array();

    let pontuacao = 0;

    //verifica se existe a variavel do jogo
    if (localStorage.hasOwnProperty("currentRanking")) {
      pontuacao = parseInt(localStorage.getItem("currentRanking"))
    }
    
    

    //Verifica se existe
    if (localStorage.hasOwnProperty("ranking"))
      ranking = JSON.parse(localStorage.getItem("ranking"));

    

    //Adiciona e salva no storage
    ranking.push([nomeField.value, pontuacao, Date.now.toString()]);
    localStorage.setItem("ranking", JSON.stringify(ranking));

    var divRanking = document.getElementById("divRanking");
    var addRanking = document.getElementById("addRanking");

    addRanking.style.display = "none";
    divRanking.classList.remove("hidden");
    
    showRanking()

    divRanking.style.display = "block";



  };
};
