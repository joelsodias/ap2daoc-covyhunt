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
  
  window.location.href = "ranking.html";
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