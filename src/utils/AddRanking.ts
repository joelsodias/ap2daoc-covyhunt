


var pontos = document.querySelector('#pontos');
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('pontos');
pontos.textContent = `${myParam}`;


document.getElementById('btConfirm').addEventListener('click', function() {

  console.log("adranking")

  // let ranking = new Array();

  // //Verifica se existe
  // if (localStorage.hasOwnProperty("ranking"))
  //   ranking = JSON.parse(localStorage.getItem("ranking"));

  // let nomes;

  // //Adiciona e salva no storage
  // ranking.push([nomes.value, myParam]);
  // localStorage.setItem("ranking", JSON.stringify(ranking));
  
  
  // var divRanking = document.getElementById("divRanking"); 
  // var addRanking = document.getElementById("addRanking"); 
 
  // addRanking.style.display = "none"; 
  // divRanking.classList.remove("hidden"); 
  // divRanking.style.display = "block";



});