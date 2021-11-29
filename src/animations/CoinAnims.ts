import Phaser from 'phaser'

const createCoinAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'coin-spinning',
		frames: anims.generateFrameNames('ss-pack-01', { start: 0, end: 3, prefix: 'coin_anim_f', suffix: '.png' }),
		frameRate: 4,
		repeat: -1
	})

	
}

export {
	createCoinAnims
}