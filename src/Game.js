import Random from './Tools/Random'
import Pool from './GameObject/Pool'
import Pools from './GameObject/Pools'
import New, { spawnOrder, bonusOrbs } from './GameObject/New'

export default class Game
{
	constructor(data)
	{
		this.data = data
		this.data.game = {
			clearScreen: 0,
			resizeWall: 0,
			hideWall: 0,
			stopWall: 0,
			slowWall: 0
		}
		New.init(data)
		this.stop = false
		this.pause = false
		this.ended = false
		this.levelStep = 5
		this.levelMax = (spawnOrder.length - 1) * this.levelStep
		this.bonusMax = bonusOrbs.length - 1
		this.level = 0
		this.data.onWindowResize = (x, y) => this._onWindowResize(x, y)
		this.context = data.context
		this.music = this.data.musics.game[Random.range(0, this.data.musics.game.length - 1)]
		this.music.loop = true
		this._poolValues = Object.keys(Pool.pools).map(k => Pool.pools[k])
		this._initBonusRules()
		this._drawBackground()
	}

	start()
	{
		this.music.play()
		New.Player()
		New.Orb()
		this._loop()
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
		this._updateLevel()
		if (Random.random() < Pools.Wall.length / 1000)
			this._spawnBonus()
		Object.keys(this.data.game)
			.forEach(k => (0 < this.data.game[k]) && (this.data.game[k] -= 1))
		this._poolValues.forEach(p => p.forEach(o => o.update()))
		this._checkEndGame()
	}

	_spawnBonus()
	{
		let bonus = null
		let player = Pools.Player.get(0)
		let wallLength = Pools.Wall.length
		while (bonus === null)
		{
			bonus = bonusOrbs[Random.range(0, this.bonusMax)]
			for (let i = 0; i < this._bonusRules.length; ++i)
				if (this._bonusRules[i](bonus, player, wallLength))
				{
					bonus = null
					break
				}
		}
		bonus()
	}

	_initBonusRules()
	{
		this._bonusRules = [
			(b, p, wLen) => New.LifeOrb === b && 3 <= p.lives,
			(b, p, wLen) => New.BerserkOrb === b && wLen <= 6,
			(b, p, wLen) => New.DestroyerOrb === b && wLen <= 12,
			(b, p, wLen) => New.TimeOrb === b && 120 <= p.countdown,
			(b, p, wLen) => New.SpeedOrb === b && 30 <= p.maxSpeed
		]
	}

	_updateLevel()
	{
		if (this.level <= this.data.information.level)
		{
			let index = this.levelMax <= this.data.information.level
				? this.levelMax
				: this.data.information.level
			spawnOrder[Random.range(0, (index / this.levelStep) | 0)]()
			this.level++
		}
	}

	_updateGameInformation()
	{
		this.data.context.drawImage(this.data.backgroundCanvas,
			this.textRect.x, this.textRect.y, this.textRect.w, this.textRect.h,
			this.textRect.x, this.textRect.y, this.textRect.w, this.textRect.h
		)
		this.data.context.font = this.data.text.font
		this.data.context.fillStyle = "black"
		let y = -this.data.text.size
		Object.keys(this.data.information)
			.forEach(
				k => this.data.context.fillText(
					typeof this.data.information[k] !== 'function'
						? this.data.information[k] | 0
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
		this._drawGameInformationLabels()
	}

	_gameInformation()
	{
		const getValue = v => () => Pool.pools.Player.get(0)[v]
		this.data.information = {
			score: getValue("score"),
			time: getValue("countdown"),
			lives: getValue("lives"),
			level: 0
		}
		this.textRect = {
			x: this.data.text.x + this.data.text.size * 3,
			y: this.data.text.y - this.data.text.size,
			h: Object.keys(this.data.information).length * this.data.text.size,
		}
		this.textRect.w = this.data.canvas.width - this.textRect.x
	}

	_drawGameInformationLabels()
	{
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
