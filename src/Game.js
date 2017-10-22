'use strict'

import Random from './Tools/Random'
import ColorTools from './Tools/ColorTools'
import Pool from './GameObject/Pool'
import Pools from './GameObject/Pools'
import New, { spawnOrder, bonusOrbs } from './GameObject/New'
import SquareWaters from './GameObject/SquareWaters'

export default class Game
{
	constructor(data)
	{
		this.data = data
		this.data.game = {
			levelStep: 0,
			durations: {
				clearScreen: 0,
				resizeWall: 0,
				hideWall: 0,
				stopWall: 0,
				slowWall: 0
			}
		}
		New.init(data)
		this._stop = false
		this.pause = false
		this.ended = false
		this.lastBonus = null
		this.levelStepMax = 5
		this.levelMax = (spawnOrder.length - 1) * this.levelStepMax
		this.bonusMax = bonusOrbs.length - 1
		this.levelStep = 0
		this.data.onWindowResize = (x, y) => this._onWindowResize(x, y)
		this.context = data.context
		this.music = this.data.musics.game[Random.range(0, this.data.musics.game.length - 1)]
		this.music.loop = true
		this.previousSecond = this.data.now
		this.i_background = 0
		this._poolValues = Object.keys(Pool.pools).map(k => Pool.pools[k])
		this.waters = new SquareWaters(this.data.middle.x, this.data.middle.y, this.data.height / 2 / this.levelStepMax, this.levelStepMax)
		this.waters.maxSize = 0
		this.data.waters = this.waters
		this._initBonusRules()
		this._initGameInformation()
		this._drawBackground()
	}

	start()
	{
		this.music.play()
		New.Player()
		New.Orb()
		this._loop()
	}

	stop()
	{
		this._stop = true
		this.music.pause()
		this.music.currentTime = 0
	}
	
	_loop()
	{
		if (! this.pause)
			this._update()
		this._draw()
		if (! this._stop)
			requestAnimationFrame(() => this._loop())
	}

	_update()
	{
		this.data.now = new Date().getTime()
		this.waters.update()
		if (this.data.frameTime === null)
			this._getFrameTime()
		this._updateLevel()
		if (Random.random() < Pools.Wall.length / 5000)
			this._spawnBonus()
		Object.keys(this.data.game.durations)
			.forEach(k => (0 < this.data.game.durations[k]) && (this.data.game.durations[k] -= 1))
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
		(this.lastBonus = bonus)()
	}

	_initBonusRules()
	{
		this._bonusRules = [
			(b) => this.lastBonus === b,
			(b, p, wLen) => New.LifeOrb === b && 3 <= p.lives,
			(b, p, wLen) => New.BerserkOrb === b && wLen <= 5,
			(b, p, wLen) => New.DestroyerOrb === b && wLen <= 10,
			(b, p, wLen) => New.TimeOrb === b && 120 <= p.countdown,
			(b, p, wLen) => New.SpeedOrb === b && 30 <= p.maxSpeed,
			(b, p, wLen) => (New.StopOrb === b || New.SlowdownOrb === b)
				&& 0 < this.data.game.durations.stopWall + this.data.game.durations.slowWall
		]
	}

	_updateLevel()
	{
		if (this.data.game.levelStep <= 0)
			return
		if (this.levelStep === 0)
		{
			let index = this.data.information.level++
			let lastWall = this.levelMax <= index
				? spawnOrder.length - 1
				: (index / this.levelStepMax)
			this.waters.maxSize = this.waters.corner * (index % this.levelStepMax)
			if (index % this.levelStepMax === 0)
			{
				index = lastWall
				this.data.sounds.levelUp.play()
				const obj = spawnOrder[index | 0]()
				const color = ColorTools.toRgba(obj.color)
				color.a = 0.5
				const color2 = {
					r: color.r / 2,
					g: color.g / 2,
					b: color.b / 2,
					a: 0.5
				}
				this.waters.generateColorsRange(color2, color)
			}
			else
			{
				index = Random.random() * 100
				index = 50 < index
					? lastWall
					: (index / 50 * lastWall)
				spawnOrder[index | 0]()
			}
		}
		this.waters.maxSize += this.waters.corner / this.levelStepMax
		this.levelStep = (this.levelStep + 1) % this.levelStepMax
		this.data.game.levelStep--
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
			this.data.frameTime = (this.data.now - this._frameStart) / 1000
		else
			this._frameStart = this.data.now
	}

	_draw()
	{
		this.data.background.fillStyle = "black"
		this.data.background.fillRect(
			this.data.bounds.x.min, this.data.bounds.y.min,
			this.data.width, this.data.height
		)
		this.waters.draw(this.data.background)
		this.data.context.drawImage(this.data.backgroundCanvas, 0, 0)
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
		//this._initGameInformation()
		this.textRect.w = this.data.canvas.width - this.textRect.x
		this._drawGameInformationLabels()
	}

	_updateBackground()
	{
		this.data.background.fillStyle = "black"
		this.data.background.fillRect(
			this.data.bounds.x.min, this.data.bounds.y.min,
			this.data.width, this.data.height
		)	
	}

	_initGameInformation()
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
			.forEach(p => p
				.forEach(o => o
					.onWindowResize(offsetX, offsetY)
				)
			)
		this.waters.setCoords(this.waters.x + offsetX, this.waters.y + offsetY)
		this._drawBackground()
	}

	_end()
	{
		this.data.sounds.gameOver.play()
		this.data.sounds.gameEnded.play()
		this.ended = true
	}
}
