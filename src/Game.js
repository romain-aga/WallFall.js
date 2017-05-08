import Random from './Tools/Random'
import Pool from './GameObject/Pool'
import Pools from './GameObject/Pools'
import New, { spawnOrder, bonusOrbs } from './GameObject/New'

export default class Game
{
	constructor(data)
	{
		this.data = data
		New.init(data)
		this.stop = false
		this.pause = false
		this.ended = false
		this.levelStep = 10
		this.levelMax = (spawnOrder.length - 1) * this.levelStep
		this.bonusMax = bonusOrbs.length - 1
		this.level = 0
		this.data.onWindowResize = (x, y) => this._onWindowResize(x, y)
		this.context = data.context
		this.music = this.data.musics.game[Random.range(0, this.data.musics.game.length - 1)]
		this.music.loop = true
		this._poolValues = Object.keys(Pool.pools).map(k => Pool.pools[k])
		this._drawBackground()
	}

	start()
	{
		this.music.play()
		New.Player()
		New.Orb()
		this._loop()
	}

	_gameInformation()
	{
		const getValue = v => () => Pool.pools.Player.get(0)[v]
		this.data.information = {
			score: getValue("score"),
			time: getValue("countdown"),
			lives: getValue("lives"),
			level: 1
		}
		const contexts = [this.data.background, this.data.context]
		contexts.forEach(c => {
			c.font = this.data.text.font
			c.fillStyle = "black"
			let y = -this.data.text.size
			Object.keys(this.data.information)
				.forEach(
					k => c.fillText(
						k + ":",
						this.data.text.x,
						this.data.text.y + (y += this.data.text.size)
					)
				)
		})
	}
	
	_loop()
	{
		if (! this.pause)
			this._update()
		this._draw()
		if (! this.stop)
			requestAnimationFrame(() => this._loop())
	}

	_update()
	{
		if (this.data.frameTime === null)
			this._getFrameTime()
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
		this._poolValues.forEach(p => p.forEach(o => o.update()))
		this._checkEndGame()
	}

	_updateGameInformation()
	{
		let w = this.data.text.size * 3
		let x = this.data.text.x + w
		let y = this.data.text.y - this.data.text.size
		let h = Object.keys(this.data.information).length * this.data.text.size
		this.data.context.drawImage(this.data.backgroundCanvas,
			x, y, w, h,
			x, y, w, h
		)
		this.data.context.font = this.data.text.font
		this.data.context.fillStyle = "black"
		y = -this.data.text.size
		Object.keys(this.data.information)
			.forEach(
				k => this.data.context.fillText(
					typeof this.data.information[k] !== 'function'
						? this.data.information[k]
						: this.data.information[k]() | 0
					,
					this.data.text.x + this.data.text.size * 3,
					this.data.text.y + (y += this.data.text.size)
				)
			)
	}

	_getFrameTime()
	{
		if (this._frameStart)
			this.data.frameTime = (new Date().getTime() - this._frameStart) / 1000
		else
			this._frameStart = new Date().getTime()
	}

	_draw()
	{
		this._poolValues.forEach(p => p.forEach(o => o.draw()))
		this._updateGameInformation()
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
		this._gameInformation()
	}

	_checkEndGame()
	{
		if (! this.ended && Pools.Player.length == 0)
			this._end()
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

	_end()
	{
		this.data.sounds.gameOver.play()
		this.data.sounds.gameEnded.play()
		this.ended = true
	}
}
