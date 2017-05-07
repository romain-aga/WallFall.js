import Pool from './GameObject/Pool'

export default class Game
{
	constructor(data)
	{
		this.data = data
		this.level = 0
		this.data.onWindowResize = (x, y) => this._onWindowResize(x, y)
		this.context = data.context
		this.music = new Audio("data/sounds/musics/game/03 - SyncroSonic.ogg")
		Pool.newPool("particles", this.data)
		Pool.newPool("explosions", this.data)
		Pool.newPool("spheres", this.data)
		Pool.newPool("walls", this.data)
		Pool.newPool("players", this.data)
		Pool.pools.particles.create = (...args) => Pool.pools.particles.new(this.data.behaviors.particle, ...args)
		Pool.pools.explosions.create = (...args) => Pool.pools.explosions.new(this.data.behaviors.explosion, ...args)
		this._poolValues = Object.keys(Pool.pools).map(k => Pool.pools[k])
		this._drawBackground()
	}
	
	start()
	{
		//this.music.play();
		Pool.pools.players.new(this.data.behaviors.player)
		Pool.pools.spheres.new(this.data.behaviors.sphere)
		this.update()
	}
	
	update()
	{
		console.log(Pool.pools.particles.length, Pool.pools.particles.objects.length)
		if (this.level < this.data.information.level | 0)
		{
			Pool.pools.walls.new(this.data.behaviors.wall)
			this.level++
		}
		this._updateObjects()
		requestAnimationFrame(() => this.update())
	}

	_drawBackground()
	{
		this.data.background.fillStyle = "gray"
		this.data.background.fillRect(0, 0, this.data.backgroundCanvas.width, this.data.backgroundCanvas.height)
		this.data.background.fillStyle = "black"
		this.data.background.fillRect(
			this.data.bounds.x.min, this.data.bounds.y.min,
			this.data.width, this.data.height
		)
		this.data.context.drawImage(this.data.backgroundCanvas, 0, 0)
	}

	_updateObjects()
	{
		this._poolValues.forEach(p => p.forEach(o => o.update()))
		this._poolValues.forEach(p => p.forEach(o => o.draw()))
	}

	_onWindowResize(offsetX, offsetY)
	{
		this._poolValues
			.forEach(p => p.forEach(o => {
				o.x += offsetX
				o.y += offsetY
			}))
		this._drawBackground()
	}
}
