import Phaser from 'phaser'

const createVaccineBoxAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'vaccine-box-open',
		frames: anims.generateFrameNames('ss-pack-01', { start: 0, end: 2, prefix: 'vaccine_box_open_anim_f', suffix: '.png' }),
		frameRate: 5
	})

	anims.create({
		key: 'vaccine-box-closed',
		frames: anims.generateFrameNames('ss-pack-01', { start: 0, end: 0, prefix: 'vaccine_box_open_anim_f', suffix: '.png' }),
		frameRate: 5
	})
}

export {
	createVaccineBoxAnims
}