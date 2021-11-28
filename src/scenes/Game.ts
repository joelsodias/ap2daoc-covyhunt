
import Phaser from 'phaser'

import { debugDraw } from '~/utils/debug'
import { createCovyAnims } from '../animations/CovyAnims'
import { createDoctorAnims } from '../animations/DoctorAnims'
import { createVaccineBoxAnims } from '../animations/VaccineBoxAnims'

import '../actors/Covy'
import Covy from '../actors/Covy'

import '../actors/Doctor'
import Doctor from '../actors/Doctor'

import { sceneEvents } from '../events/EventsCenter'

import VaccineBox from '../items/VaccineBox'


export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private doctor!: Doctor

	private injections!: Phaser.Physics.Arcade.Group
	private enemies!: Phaser.Physics.Arcade.Group

	private PlayerEnemiesCollider?: Phaser.Physics.Arcade.Collider

	constructor()
	{
		super('game')
	}

	preload()
    {
		this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {
		this.scene.run('game-ui')

		createDoctorAnims(this.anims)
		createCovyAnims(this.anims)
		createVaccineBoxAnims(this.anims)

		const map = this.make.tilemap({ key: 'map-01' })
		const tileset = map.addTilesetImage('map-01','tiles', 16, 16, 1, 2)

		map.createLayer('Ground', tileset)

		this.injections = this.physics.add.group({
			classType: Phaser.Physics.Arcade.Image,
			maxSize: 3
		})

		this.doctor = this.add.doctor(100, 100, 'ss-doc')
		this.doctor.setinjections(this.injections)

		const wallsLayer = map.createLayer('Walls', tileset)

		wallsLayer.setCollisionByProperty({ collides: true })

		const vaccineBox = this.physics.add.staticGroup({
			classType: VaccineBox
		})
		const vBoxLayer = map.getObjectLayer('VaccineBox')
		vBoxLayer.objects.forEach(vBoxObj => {
			vaccineBox.get(vBoxObj.x! + vBoxObj.width! * 0.5, vBoxObj.y! - vBoxObj.height! * 0.5, 'ss-pack-01')
		})

		this.cameras.main.startFollow(this.doctor, true)

		this.enemies = this.physics.add.group({
			classType: Covy,
			createCallback: (go) => {
				const covyGo = go as Covy
				covyGo.body.onCollide = true 
			}
		})

		const enemiesLayer = map.getObjectLayer('Enemies')
		enemiesLayer.objects.forEach(enemyObj => {
			this.enemies.get(enemyObj.x! + enemyObj.width! * 0.5, enemyObj.y! - enemyObj.height! * 0.5, 'ss-covy')
		})

		this.physics.add.collider(this.doctor, wallsLayer)
		this.physics.add.collider(this.enemies, wallsLayer)

		this.physics.add.collider(this.doctor, vaccineBox, this.handlePlayerVaccineBoxCollision, undefined, this)

		this.physics.add.collider(this.injections, wallsLayer, this.handleInjectionWallCollision, undefined, this)
		this.physics.add.collider(this.injections, this.enemies, this.handleInjectionEnemyCollision, undefined, this)

		this.PlayerEnemiesCollider = this.physics.add.collider(this.enemies, this.doctor, this.handlePlayerEnemiesCollision, undefined, this)
	}

	private handlePlayerVaccineBoxCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		const box = obj2 as VaccineBox
		this.doctor.setVaccineBox(box)
	}

	private handleInjectionWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		this.injections.killAndHide(obj1)
	}

	private handleInjectionEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		this.injections.killAndHide(obj1)
		this.enemies.killAndHide(obj2)
	}

	private handlePlayerEnemiesCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		const covy = obj2 as Covy
		
		const dx = this.doctor.x - covy.x
		const dy = this.doctor.y - covy.y

		const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

		this.doctor.handleHURT(dir)

		sceneEvents.emit('player-health-changed', this.doctor.health)

		if (this.doctor.health <= 0)
		{
			this.PlayerEnemiesCollider?.destroy()
		}
	}
	
	update(t: number, dt: number) 
	{
		if (this.doctor)
		{
			this.doctor.update(this.cursors)
		}
	}
}
