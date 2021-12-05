
<img src="../dist/images/logo.png" alt="logo" width="150"/>

Version 0.0.1

# Documentação


Este jogo foi desenvolvido utilizando a linguagem Typescript com o auxílio de uma engine para desenvolvimento de jogos 2d chamada [Phaser](https://phaser.io/) (versão 3.55.2)

## Typescript

TypeScript é uma linguagem de programação fortemente tipada que se baseia em JavaScript, oferecendo melhores ferramentas em qualquer escala.

O TypeScript adiciona sintaxe adicional ao JavaScript para oferecer suporte a uma integração mais estreita com editores de código, identificando alguns os erros no diretamente durante a escrita.

Documentação completa pode ser encontrada em: [typescriptlang.org](https://www.typescriptlang.org/)

## Phaser

Biblioteca JavaScript para criação da jogabilidade, movimento dos personagens, ações e fisicas aplicadas. 

Documentação completa pode ser encontrada em: [https://phaser.io/](https://phaser.io/)

## Parcel

Parcel é classificado como *builder* (usado para fazer a compilação e empacotamento) para aplicações web o qual pode manipular JavaScript, CSS, HTML, TypeScript, Node, React, Vue, CoffeeScript, Electron and more.

Documentação completa pode ser encontrada em: [https://parceljs.org/](https://parceljs.org/)

## Estrutura do Jogo

O jogo começa na página [main.ts](../src/main.ts) que é responsável por configurar o Phaser, passando alguns parâmetros necessários, recebendo também as cenas. Toda a estrutura do jogo é baseado nestas cenas. Cada cena tem a sua função:

* **Preloader**: A cena [Preloader.ts](../src/scenes/Preloader.ts) é responsável por carregar todos os objetos do jogo, desde o cabeçalho de pontos e vidas, até o labirinto, personagens, armas, espaços em que os objetos são instalados no labirinto, etc.

* **GameScene**: A cena [GameScene.ts](../src/scenes/GameScene.ts) realiza a criação dos espaços do jogo, criando o labirinto e áreas que os personagens podem se movimentar, localização onde os objetos criados no Preload ficarão dentro da tela. Criação da movimentação dos personagens, covid e doctor.

* **GameUI**: A cena [GameUI.ts](../src/scenes/GameUI.ts) realiza a criação do cabeçalho e suas funções, vidas, vacinas e pontos (moedas).
 
 Também temos dentro do [main.ts](../src/main.ts)  as configurações de ações dos botões das telas de menu e ranking.
 
## Divisão da aplicação 
 
### Armazenamento 

Para fazer o armazenamento dos dados do jogo e também para criar o ranking do Covy Hunt, utilizamos o [LocalStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage) que faz parte de uma API de javascript chamada Web Storage. O mesmo guarda no cache do navegador os pares de chave e valor. O LocalStorage foi uma alternativa muito bem vista para o nosso projeto, pois se trata de um jogo simples que não carrega nenhum dado sensível do usuário. 

### Animações 

Cada objeto tem sua própria animação, organizada dentro da sua própria pasta. Assim como os objetos, cada ator (personagem) tem suas animações.

### Mapas

Para a confecção dos mapas utilizamos o programa [Tiled](https://www.mapeditor.org/), uma plataforma antiga no mercado de games mas bastante confiável e útil para desenvolvimento de games em blocos. Nele montamos o jogo no estilo 2D, ele foi essencial para o desenvolvimento pois podemos criar diferentes camadas e setar algumas propriedades como colisões e interações com objetos, que depois serviram para definir comportamentos pelo PHASER.
        

