import Phaser from 'phaser'

const createDoctorAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
        key: "doc-walk-right",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [0, 1, 2],
        }),
        frameRate: 4,
        repeat: -1,
      });
  
      anims.create({
        key: "doc-stop-right",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [1],
        }),
        frameRate: 4,
        repeat: 0,
      });
  
      anims.create({
        key: "doc-walk-left",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [3, 4, 5],
        }),
        frameRate: 4,
        repeat: -1,
      });
  
      anims.create({
        key: "doc-stop-left",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [4],
        }),
        frameRate: 4,
        repeat: 0,
      });
  
      anims.create({
        key: "doc-walk-down",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [6, 7, 8],
        }),
        frameRate: 4,
        repeat: -1,
      });
  
      anims.create({
        key: "doc-stop-down",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [7],
        }),
        frameRate: 4,
        repeat: 0,
      });
  
      anims.create({
        key: "doc-walk-up",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [9, 10, 11],
        }),
        frameRate: 4,
        repeat: -1,
      });
  
      anims.create({
        key: "doc-stop-up",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [10],
        }),
        frameRate: 4,
        repeat: 0,
      });

      anims.create({
        key: "doc-angry",
        frames: anims.generateFrameNumbers("ss-doc", {
          frames: [10],
        }),
        frameRate: 4,
        repeat: -1,
      });
}

export {
	createDoctorAnims
}