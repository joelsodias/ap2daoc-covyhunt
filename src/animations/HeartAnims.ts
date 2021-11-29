import Phaser from 'phaser'

const createHeartAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'heart-spinning',
		frames: anims.generateFrameNames('ss-pack-01', { start: 0, end: 3, prefix: 'heart_anim_f', suffix: '.png' }),
		frameRate: 4,
		repeat: -1
	})

	
}

export {
	createHeartAnims
}