import Phaser from "phaser";

const createDoctorAnims = (anims: Phaser.Animations.AnimationManager) => {
 
  anims.create({
    key: "doc-walk-right-injection",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [0, 1, 2, 1],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-right-injection",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [1],
    }),
    frameRate: 4,
    repeat: 0,
  });

  anims.create({
    key: "doc-walk-left-injection",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [3, 4, 5, 3],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-left-injection",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [4],
    }),
    frameRate: 4,
    repeat: 0,
  });

  anims.create({
    key: "doc-walk-down-injection",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [6, 7, 8, 7],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-down-injection",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [7],
    }),
    frameRate: 4,
    repeat: 0,
  });

  anims.create({
    key: "doc-walk-up-injection",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [9, 10, 11, 10],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-up-injection",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [10],
    }),
    frameRate: 4,
    repeat: 0,
  });

 
 //////////////////////////////////
 
  anims.create({
    key: "doc-walk-right",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [12, 13, 14, 13],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-right",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [13],
    }),
    frameRate: 4,
    repeat: 0,
  });

  anims.create({
    key: "doc-walk-left",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [15, 16, 17, 16],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-left",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [16],
    }),
    frameRate: 4,
    repeat: 0,
  });

  anims.create({
    key: "doc-walk-down",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [18, 19, 20, 19],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-down",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [19],
    }),
    frameRate: 4,
    repeat: 0,
  });

  anims.create({
    key: "doc-walk-up",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [21, 22, 23, 22],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-up",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [22],
    }),
    frameRate: 4,
    repeat: 0,
  });

  anims.create({
    key: "doc-stop-success",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [19, 24, 25, 26],
    }),
    frameRate: 4,
    repeat: -1,
  });

  anims.create({
    key: "doc-stop-fail",
    frames: anims.generateFrameNumbers("ss-doc", {
      frames: [24, 27],
    }),
    frameRate: 3,
    repeat: -1,
  });
};

export { createDoctorAnims };
