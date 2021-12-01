import Phaser from 'phaser'

export default class VaccineBox extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

		this.play('vaccine-box-full')
	}

	open()
	{
		if (this.anims.currentAnim.key !== 'vaccine-box-full')
		{
			return 0
		}

		this.play('vaccine-box-empty')
		return Phaser.Math.Between(50, 200)
	}
}