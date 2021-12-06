import Phaser, { Game } from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      speechBalloonBitmapText(
        x: number,
        y: number,
        text: string[],
        position:SpeechBalloonPosition,
        font: string,
        fontSize: number,
        color: number
      ): SpeechBalloonBitmapText;
    }
  }
}

export enum SpeechBalloonPosition {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}


export default class SpeechBalloonBitmapText extends Phaser.GameObjects
  .Graphics {
  private font: string;
  private text: string[];
  private textObj: Phaser.GameObjects.BitmapText;
  private fontSize: number;
  private color: number;

  private textX:number;
  private textY:number;

  

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string[],
    position:SpeechBalloonPosition,
    font: string,
    fontSize: number,
    color: number
  ) {
    super(scene, { x: x, y: y });

    this.font = font;
    this.text = text;
    this.fontSize = fontSize;
    this.color = color;

    var bubbleX, bubbleY, bubbleWidth, bubbleHeight: number;
    var arrowHeight, shaddowOffsetX, shaddowOffsetY: number;
    var point1X, point1Y, point2X, point2Y, point3X, point3Y: number;

    arrowHeight = 15;
    shaddowOffsetX = 6;
    shaddowOffsetY = 6;

    var textObj = this.scene.add
      .bitmapText(x + 10, y + 10, this.font, this.text, this.fontSize)
      //.setOrigin(0.5)
      .setTint(this.color, this.color, this.color, this.color);

    var messageWidth = textObj.width;
    var messageHeight = textObj.height;

    bubbleWidth = messageWidth + 20;
    bubbleHeight = messageHeight + 20;

    //var divisor = 

    textObj.destroy();

    switch (position) {
      
      default:
      case SpeechBalloonPosition.TOP:
        point1X = 0;
        point1Y = 0;

        point2X = -Math.floor(bubbleWidth / 8);
        point2Y = -arrowHeight;

        point3X = +Math.floor(bubbleWidth / 8);
        point3Y = -arrowHeight;

        bubbleX = -Math.floor(bubbleWidth / 2);
        bubbleY = -arrowHeight - bubbleHeight;

       



        break;

        case SpeechBalloonPosition.BOTTOM:
          point1X = 0;
          point1Y = 0;
  
          point2X = -Math.floor(bubbleHeight / 3);
          point2Y = +arrowHeight;
  
          point3X = +Math.floor(bubbleWidth / 8);
          point3Y = +arrowHeight;
  
          bubbleX = -Math.floor(bubbleWidth / 2);
          bubbleY = +arrowHeight;
  
          break;


        case SpeechBalloonPosition.LEFT:
          point1X = 0;
          point1Y = 0;
  
          point2X = - arrowHeight - 1;
          point2Y = -Math.floor(bubbleHeight / 3);
  
          point3X = - arrowHeight - 1;
          point3Y = Math.floor(bubbleHeight / 3) ;
  
          bubbleX = -Math.floor(bubbleWidth / 2);
          bubbleY = +arrowHeight;
  
          bubbleX = -bubbleWidth - arrowHeight;
          bubbleY = -Math.floor(bubbleHeight / 2);;
  
          break;

          case SpeechBalloonPosition.RIGHT:
            point1X = 0;
            point1Y = 0;
    
            point2X = arrowHeight + 1;
            point2Y = -Math.floor(bubbleHeight / 3);
    
            point3X = arrowHeight + 1;
            point3Y = Math.floor(bubbleHeight / 3) ;
    
            bubbleX = Math.floor(bubbleWidth / 2);
            bubbleY = +arrowHeight;
    
            bubbleX = arrowHeight;
            bubbleY = -Math.floor(bubbleHeight / 2);;
    
            break;
      
    }

    this.setTextPosition(this.x + bubbleX + 10, this.y + bubbleY + 10);


    // shaddow
    this.fillStyle(0x222222, 0.5);
    this.fillRoundedRect(
      bubbleX + shaddowOffsetX,
      bubbleY + shaddowOffsetY,
      bubbleWidth,
      bubbleHeight,
      16
    );
    this.fillTriangle(
      point1X, // + shaddowOffsetX,
      point1Y, // + shaddowOffsetY,
      point2X + shaddowOffsetX,
      point2Y + shaddowOffsetY,
      point3X + shaddowOffsetX,
      point3Y + shaddowOffsetY
    );

    // main bubble
    this.fillStyle(0xffffff, 1);
    this.lineStyle(4, 0x565656, 1);
    this.strokeRoundedRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 16);
    this.fillRoundedRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 16);

    this.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    this.lineStyle(2, 0x565656, 1);
    this.lineBetween(point1X, point1Y, point2X, point2Y);
    this.lineBetween(point1X, point1Y, point3X, point3Y);

    
  }

  setTextObject(obj: Phaser.GameObjects.BitmapText) {
    this.textObj = obj;
  }

  protected preDestroy(): void {
    this.textObj.destroy();
  }

  private setTextPosition(x:number, y:number) {
     this.textX = x;
     this.textY = y;
  }

  getTextPosition() : Phaser.Types.GameObjects.Graphics.Options {
    return {x:this.textX, y:this.textY} 
  }
  


}

Phaser.GameObjects.GameObjectFactory.register(
  "speechBalloonBitmapText",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    text: string[],
    position:SpeechBalloonPosition,
    font: string,
    fontSize: number,
    color: number
  ) {
    var graphic = new SpeechBalloonBitmapText(
      this.scene,
      x,
      y,
      text,
      position,
      font,
      fontSize,
      color
    );

    this.displayList.add(graphic);

    var textObj = this.scene.add
      .bitmapText(graphic.getTextPosition().x, graphic.getTextPosition().y, font, text, fontSize)
      //.setOrigin(0.5)
      .setTint(color, color, color, color);

    graphic.setTextObject(textObj);

    return graphic;
  }
);
