import Phaser from 'phaser'
import VaccineBox from '../items/VaccineBox'
import Injection from '../items/Injection'

import { sceneEvents } from '../events/EventsCenter'

declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			doctor(x: number, y: number, texture: string, frame?: string | number): Doctor
		}
	}
}

enum HealthState
{
	STOPED,
	HURT,
	DEAD
}

export default class Doctor extends Phaser.Physics.Arcade.Sprite
{
	private healthState = HealthState.STOPED
	private HURTTime = 0

	private _health = 5
	private _coins = 0

	private injections?: Phaser.Physics.Arcade.Group
	private activeVaccineBox?: VaccineBox

	get health()
	{
		return this._health
	}

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

		this.anims.play('doc-stop-down')
	}

	setinjections(injections: Phaser.Physics.Arcade.Group)
	{
		this.injections = injections
	}

	setVaccineBox(VaccineBox: VaccineBox)
	{
		this.activeVaccineBox = VaccineBox
	}

	handleHURT(dir: Phaser.Math.Vector2)
	{
		if (this._health <= 0)
		{
			return
		}

		if (this.healthState === HealthState.HURT)
		{
			return
		}

		--this._health

		if (this._health <= 0)
		{
			// TODO: die
			this.healthState = HealthState.DEAD
			this.anims.play('doc-angry')
			this.setVelocity(0, 0)
		}
		else
		{
			this.setVelocity(dir.x, dir.y)

			this.setTint(0xff0000)

			this.healthState = HealthState.HURT
			this.HURTTime = 0
		}
	}

	private throwInjection()
	{
		if (!this.injections)
		{
			return
		}


		const injection = this.injections.get(this.x, this.y, 'injection') as Phaser.Physics.Arcade.Image

		if (!injection)
		{
			return
		}

		const parts = this.anims.currentAnim.key.split('-')
		const direction = parts[2]

		const vec = new Phaser.Math.Vector2(0, 0)

		switch (direction)
		{
			case 'up':
				vec.y = -1
				break

			case 'down':
				vec.y = 1
				break

			default:
			case 'side':
				if (this.scaleX < 0)
				{
					vec.x = -1
				}
				else
				{
					vec.x = 1
				}
				break
		}

		const angle = vec.angle()

		injection.setActive(true)
		injection.setVisible(true)

		injection.setRotation(angle)

		injection.x += vec.x * 16
		injection.y += vec.y * 16

		injection.setVelocity(vec.x * 300, vec.y * 300)
	}

	preUpdate(t: number, dt: number)
	{
		super.preUpdate(t, dt)

		switch (this.healthState)
		{
			case HealthState.STOPED:
				break

			case HealthState.HURT:
				this.HURTTime += dt
				if (this.HURTTime >= 250)
				{
					this.healthState = HealthState.STOPED
					this.setTint(0xffffff)
					this.HURTTime = 0
				}
				break
		}
	}

	update(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
	{
		if (this.healthState === HealthState.HURT
			|| this.healthState === HealthState.DEAD
		)
		{
			return
		}

		if (!cursors)
		{
			return
		}

		if (Phaser.Input.Keyboard.JustDown(cursors.space!))
		{
			if (this.activeVaccineBox)
			{
				const coins = this.activeVaccineBox.open()
				this._coins += coins

				sceneEvents.emit('player-coins-changed', this._coins)
			}
			else
			{
				this.throwInjection()
			}
			return
		}

		const speed = 100

		const leftDown = cursors.left?.isDown
		const rightDown = cursors.right?.isDown
		const upDown = cursors.up?.isDown
		const downDown = cursors.down?.isDown

		if (leftDown)
		{
			this.anims.play('doc-walk-left', true)
			this.setVelocity(-speed, 0)

			//this.scaleX = -1
			this.body.offset.x = 8
		}
		else if (rightDown)
		{
			this.anims.play('doc-walk-right', true)
			this.setVelocity(speed, 0)

			//this.scaleX = 1
			this.body.offset.x = 8
		}
		else if (upDown)
		{
			this.anims.play('doc-walk-up', true)
			this.setVelocity(0, -speed)
		}
		else if (downDown)
		{
			this.anims.play('doc-walk-down', true)
			this.setVelocity(0, speed)
		}
		else
		{
			const parts = this.anims.currentAnim.key.split('-')
			parts[1] = 'stop'
			this.anims.play(parts.join('-'))
			this.setVelocity(0, 0)
		}

		if (leftDown || rightDown || upDown || downDown)
		{
			this.activeVaccineBox = undefined
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('doctor', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	var sprite = new Doctor(this.scene, x, y, texture, frame)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

	return sprite
})
