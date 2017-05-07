import Random from './Tools/Random'
import Pool from './GameObject/Pool'
import New, { spawnOrder, bonusOrbs } from './GameObject/New'

export default class Game
{
	constructor(data)
	{
		New.init(data)
		this.levelStep = 10
		this.levelMax = (spawnOrder.length - 1) * this.levelStep
		this.bonusMax = bonusOrbs.length - 1
		this.data = data
		this.level = 0
		this.data.onWindowResize = (x, y) => this._onWindowResize(x, y)
		this.context = data.context
		this.music = new Audio("data/sounds/musics/game/03 - SyncroSonic.ogg")
		this._poolValues = Object.keys(Pool.pools).map(k => Pool.pools[k])
		this._drawBackground()
	}
	
	start()
	{
		//this.music.play();
		New.Player()
		New.Orb()
		this.update()
	}
	
	update()
	{
		if (this.level < this.data.information.level)
		{
			let index = this.levelMax <= this.data.information.level
				? this.levelMax
				: this.data.information.level
			spawnOrder[Random.range(0, (index / this.levelStep) | 0)]()
			this.level++
		}
		if (Random.random() < 0.001)
			bonusOrbs[Random.range(0, this.bonusMax)]()
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
