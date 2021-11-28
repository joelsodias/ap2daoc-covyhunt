import Phaser from 'phaser'

const createCovyAnims = (anims: Phaser.Animations.AnimationManager) => {
	
  anims.create({
    key: "covy-stop-left",
    frames: anims.generateFrameNumbers("ss-corona", {
      frames: [0],
    }),
    frameRate: 4,
    repeat: 0
  });
  
  anims.create({
        key: "covy-walk-left",
        frames: anims.generateFrameNumbers("ss-corona", {
          frames: [0, 2, 0, 2, 0, 3, 0, 2],
        }),
        frameRate: 4,
        repeat: -1,
      });
  
      anims.create({
        key: "covy-walk-right",
        frames: anims.generateFrameNumbers("ss-corona", {
          frames: [4, 6, 4, 6, 4, 7, 4, 6],
        }),
        frameRate: 4,
        repeat: -1,
      });
  
      anims.create({
        key: "covy-walk-down",
        frames: anims.generateFrameNumbers("ss-corona", {
          frames: [
            12, 14, 12, 14, 12, 19, 12, 14, 12, 15, 12, 14, 12, 19, 12, 14,
          ],
        }),
        frameRate: 4,
        repeat: -1,
      });
  
      anims.create({
        key: "covy-walk-up",
        frames: anims.generateFrameNumbers("ss-corona", {
          frames: [20, 21, 22, 21],
        }),
        frameRate: 4,
        repeat: -1,
      });
}

export {
	createCovyAnims
}