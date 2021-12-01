var menu = document.getElementById("menu");
var ranking = document.getElementById("ranking");
var addRanking = document.getElementById("addRanking");
var phaser_game = document.getElementById("phaser-game");
var loading = document.getElementById("loading");

document.getElementById('rankingButton').addEventListener('click', function(){
    menu.classList.add("hide");
    ranking.classList.remove("hide");
    addRanking.classList.add("hide");
    phaser_game.classList.add("hide");
    loading.classList.add("hide");
});

document.getElementById('jogar').addEventListener('click', function(){
    menu.classList.add("hide");
    ranking.classList.add("hide");
    addRanking.classList.add("hide");
    phaser_game.classList.remove("hide");
    loading.classList.remove("hide");
});

document.getElementById('buttonBack').addEventListener('click', function(){
    menu.classList.remove("hide");
    ranking.classList.add("hide");
    addRanking.classList.add("hide");
    phaser_game.classList.add("hide");
    loading.classList.add("hide");
});


document.getElementById('buttonCancel').addEventListener('click', function(){
    menu.classList.remove("hide");
    ranking.classList.add("hide");
    addRanking.classList.add("hide");
    phaser_game.classList.add("hide");
    loading.classList.add("hide");
});

//script addranking

var pontos = document.querySelector('#pontos')
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('pontos');
pontos.textContent = `${myParam}`;


document.getElementById('confirmar').addEventListener('click', function() {
  let ranking = new Array();

  //Verifica se existe
  if (localStorage.hasOwnProperty("ranking"))
    ranking = JSON.parse(localStorage.getItem("ranking"));

  //Adiciona e salva no storage
  ranking.push([nomes.value, myParam]);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  
    menu.classList.add("hide");
    ranking.classList.remove("hide");
    addRanking.classList.add("hide");
    phaser_game.classList.add("hide");
    loading.classList.add("hide");
});

function doNothing() {  
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if( keyCode == 13 ) {
      if(!e) var e = window.event;
  
      e.cancelBubble = true;
      e.returnValue = false;
  
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  } 

//fim script addranking

//script ranking

const setValue = (value) => localStorage.setItem("ranking", JSON.stringify(value))

const getValue = () => {
  const value = localStorage.getItem("ranking")
  return value ? JSON.parse(value) : []
}

const main = () => {
  const $list = document.querySelector('#list')

  const render = () => {
    const array = getValue()

    const arraySorted = array.sort((a, b) => {
      const aa = Number(a[1])
      const bb = Number(b[1])
      if (aa < bb) return -1;
      return aa > bb ? 1 : 0;
    }).reverse()

    const html = arraySorted.map(([name, total]) => `
      <li>${total} | ${name}</li>
    `)
    $list.innerHTML = html.join('')
  }

  render()
}

document.addEventListener('DOMContentLoaded', main)

//fim script ranking