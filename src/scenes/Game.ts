
import Phaser, { Tilemaps } from 'phaser'

import { debugDraw } from '~/utils/debug'
import { createCovyAnims } from '../animations/CovyAnims'
import { createDoctorAnims } from '../animations/DoctorAnims'
import { createVaccineBoxAnims } from '../animations/VaccineBoxAnims'
import { createCoinAnims } from '../animations/CoinAnims'
import { createHeartAnims } from '../animations/HeartAnims'

import '../actors/Covy'
import Covy from '../actors/Covy'

import '../actors/Doctor'
import Doctor from '../actors/Doctor'

import { sceneEvents } from '../events/EventsCenter'

import VaccineBox from '../items/VaccineBox'
import Coin from '../items/Coin'
import Heart from '../items/Heart'


export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private doctor!: Doctor

	private injections!: Phaser.Physics.Arcade.Group
	private enemies!: Phaser.Physics.Arcade.Group
	private coins!: Phaser.Physics.Arcade.Group

	private PlayerEnemiesCollider?: Phaser.Physics.Arcade.Collider

	private map!: Phaser.Tilemaps.Tilemap;


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
		createCoinAnims(this.anims)
		createHeartAnims(this.anims)

		this.map = this.make.tilemap({ key: 'map' })
		const map = this.map;

		//const tileset = map.addTilesetImage('map','tiles', 16, 16, 1, 2)
		const tileset = map.addTilesetImage('map-base','tiles', 16, 16, 0, 0)

		const groundLayer = map.createLayer('Ground', tileset)
		const wallsLayer = map.createLayer('Walls', tileset)
		wallsLayer.setCollisionByProperty({ collides: true })


		this.injections = this.physics.add.group({
			classType: Phaser.Physics.Arcade.Sprite,
			maxSize: 5
		})

		this.doctor = this.add.doctor(100, 100, 'ss-doc')
		this.doctor.setinjections(this.injections)
		this.cameras.main.startFollow(this.doctor, true)


		const vaccineBoxGroup = this.physics.add.staticGroup({
			classType: VaccineBox
		})
		const vaccineBoxLayer = map.getObjectLayer('VaccineBox')
		vaccineBoxLayer.objects.forEach(vBoxObj => {
			vaccineBoxGroup.get(vBoxObj.x! + vBoxObj.width! * 0.5, vBoxObj.y! - vBoxObj.height! * 0.5, 'ss-pack-01')
		})

		const heartGroup = this.physics.add.staticGroup({
			classType: Heart
		})
		const heartLayer = map.getObjectLayer('Hearts')
		heartLayer.objects.forEach(heartObj => {
			heartGroup.get(heartObj.x! + heartObj.width! * 0.5, heartObj.y! - heartObj.height! * 0.5, 'ss-pack-01')
		})


		this.coins = this.physics.add.group({
			classType: Coin
		})
		const coinsLayer = map.getObjectLayer('Coins')
		coinsLayer.objects.forEach(coinObj => {
			this.coins.get(coinObj.x! + coinObj.width! * 0.5, coinObj.y! - coinObj.height! * 0.5, 'ss-pack-01')
		})


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

		this.physics.add.collider(this.doctor, heartGroup, this.handlePlayerHeartCollision, undefined, this)
		this.physics.add.collider(this.doctor, vaccineBoxGroup, this.handlePlayerVaccineBoxCollision, undefined, this)
		this.physics.add.collider(this.doctor, this.coins, this.handlePlayerCoinsCollision, undefined, this)

		this.physics.add.collider(this.injections, wallsLayer, this.handleInjectionWallCollision, undefined, this)
		this.physics.add.collider(this.injections, this.enemies, this.handleInjectionEnemyCollision, undefined, this)

		this.PlayerEnemiesCollider = this.physics.add.collider(this.enemies, this.doctor, this.handlePlayerEnemiesCollision, undefined, this)
	}

	private handlePlayerHeartCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		obj2.destroy();
		var doc = obj1 as Doctor 
		doc.collectHealth(1)
	}

	private handlePlayerCoinsCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		obj2.destroy();
		var doc = obj1 as Doctor 
		doc.collectCoin(1)
	}

	private handlePlayerVaccineBoxCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		const box = obj2 as VaccineBox
		this.doctor.setVaccineBox(box)
	}

	private handleInjectionWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		this.injections.killAndHide(obj1)
		obj1.destroy();
	}

	private handleInjectionEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		this.injections.killAndHide(obj1)
		this.enemies.killAndHide(obj2)
		obj1.destroy();
		obj2.destroy();
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
