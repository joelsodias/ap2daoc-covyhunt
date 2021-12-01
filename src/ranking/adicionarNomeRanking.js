var pontos = document.querySelector('#pontos')
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('pontos');
const dificuldade = urlParams.get('dificuldade');
pontos.textContent = `${myParam}`;


document.getElementById('confirmar').addEventListener('click', function() {
    let facil = new Array();
    let medio = new Array();
    let dificil = new Array();

    //Verifica se existe
    if (localStorage.hasOwnProperty("facil")) {
        facil = JSON.parse(localStorage.getItem("facil"))
    }
    if (localStorage.hasOwnProperty("medio")) {
        medio = JSON.parse(localStorage.getItem("medio"))
    }
    if (localStorage.hasOwnProperty("dificil")) {
        dificil = JSON.parse(localStorage.getItem("dificil"))
    }

    //Adiciona e salva no storage
    if(dificuldade == "f"){
        facil.push([nomes.value, myParam]);
        localStorage.setItem("facil", JSON.stringify(facil));
    }else if(dificuldade == "m"){
        medio.push([nomes.value, myParam]);
        localStorage.setItem("medio", JSON.stringify(medio));
    }else if(dificuldade == "d"){
        dificil.push([nomes.value, myParam]);
        localStorage.setItem("dificil", JSON.stringify(dificil));
    }
       
    //Redireciona
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