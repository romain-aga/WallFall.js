'use strict'

import Random from '../../Tools/Random'
import Collision from '../../Tools/Collision'
import MathTools from '../../Tools/MathTools'
import GameObjectBehavior from '../GameObjectBehavior'
import Pools from '../Pools'
import New from '../New'
import Behaviors from '../Behaviors'

export default class BaseWall extends GameObjectBehavior
{
	constructor()
	{
		super()
		this.poolName = 'Wall'
	}

	init(self, sprite, color)
	{
		self.sprite = sprite
		self.width = self.sprite.width
		self.height = self.sprite.height
		self.halfWidth = self.width / 2
		self.halfHeight = self.height / 2
		self.color = color
		self.realSprite = self.sprite
		self.realColor = self.color
		self.i_particle = 0
		self.i_newCoord = 0
		self.speed = 2.82
		self.coordOffset = 80
		BaseWall._bounds = BaseWall._bounds || [
			self.data.bounds.x.min - self.width * 2 - self.coordOffset,
			self.data.bounds.y.max + self.width + self.coordOffset,
			self.data.bounds.x.max + self.width + self.coordOffset,
			self.data.bounds.y.min - self.width * 2 - self.coordOffset
		]
		this.newCoords(self)
	}

	newCoords(self)
	{
		self.i_newCoord = 5
		let findNewCoords = true
		let tries = 10
		while (findNewCoords && 0 < tries--)
		{
			self.direction = Random.range(0, 3)
			let random = Random.random() * (self.data.width - self.width)
			self.x = (self.direction % 2 === 0) && BaseWall._bounds[self.direction]
				|| self.data.bounds.x.min + random
			self.y = (self.direction % 2 !== 0) && BaseWall._bounds[self.direction]
				|| self.data.bounds.y.min + random
			findNewCoords = Pools.Wall.find(
				w => w !== self
					&& w.x < self.x + self.width && self.x - self.width < w.x
					&& w.y < self.y + self.height && self.y - self.height < w.y
				)
		}
	}

	penalties(self, player)
	{
		player.lives--
		player.stateValues.god = player.stateDuration / 4
	}

	update(self)
	{
		this.special(self)
		this.changeSpeed(self)
		this.move(self)
		if (self.speed)
			this.updateWater(self, self.direction * 90, self.speed, Collision.dotRect)
		this.collision(self)
		this.particles(self)
	}

	draw(self)
	{
		if (self.data.game.durations.resizeWall <= 0)
			super.draw(self)
		else
		{
			self.cleanDrawing()
			self.data.context.drawImage(self.sprite,
				(self.x + self.halfWidth / 2) | 0,
				(self.y + self.halfHeight / 2) | 0,
				self.halfWidth,
				self.halfHeight
			)
		}
	}

	special(self)
	{
		if (self.data.game.durations.hideWall <= 0)
		{
			self.color = self.realColor
			self.sprite = self.realSprite
		}
		else
		{
			self.color = Behaviors.HideWall.color
			self.sprite = Behaviors.HideWall.sprite
		}
	}

	move(self)
	{
		if (0 < self.data.game.durations.stopWall)
			return
		let rad = MathTools.rads(self.direction * 90)
		let cos = Math.cos(rad)
		let sin = Math.sin(rad)
		let distanceRespawn = self.data.width / 2 + self.width
		let speed = self.speed
		if (30 <= self.data.game.durations.slowWall)
			speed = speed / self.data.game.durations.slowWall * 30
		if (self.direction === 0 && self.data.bounds.x.max < self.x
			|| self.direction === 1 && self.y < self.data.bounds.y.min - self.width
			|| self.direction === 2 && self.x < self.data.bounds.x.min - self.width
			|| self.direction === 3 && self.data.bounds.y.max < self.y
		)
			this.newCoords(self)
		else
		{
			self.x += cos * speed
			self.y -= sin * speed
		}
	}

	changeSpeed(self)
	{
	}

	explosion(self, particleSpeed)
	{
		let color = self.data.game.durations.hideWall <= 0
			? self.color
			: Behaviors.HideWall.color
		New.Explosion(self.x, self.y, self.width, self.color, true, particleSpeed)
	}

	particles(self)
	{
		if (! self.speed)
			return
		if (self.i_particle++ % 8 === 0)
		{
			let direction = 0
			let speed = 0
			let decreaseSpeed = 0.5
			if (self.i_newCoord)
			{
				self.i_newCoord--
				direction = self.direction * 90
				speed = self.speed * 5
				decreaseSpeed = 1
			}
			let color = self.data.game.durations.hideWall <= 0
				? self.color
				: Behaviors.HideWall.color
			New.Particle(self.x, self.y, direction, speed, self.width, self.color, true, decreaseSpeed)
		}
	}

	collision(self)
	{
		Pools.Player.forEach(
            p => (p.stateValues.god <= 0 || 0 < p.stateValues.berserk) && Collision.circleRect(p, self)
				&& (
					p.stateValues.berserk <= 0
					? this.penalties(self, p)
					: self.destroy() || (p.stateValues.berserk = 0)
				)
        )
	}

	destroy(self)
	{
		self.data.sounds.wallExplosion.play()
		this.explosion(self)
	}

	updateRectToClean(self, rect)
	{
		rect.x = (self.x - 3) | 0
		rect.y = (self.y - 3) | 0
		rect.w = (self.width + 6) | 0
		rect.h = (self.height + 6) | 0
	}

	onWindowResize(self, offsetX, offsetY)
	{
		super.onWindowResize(self, offsetX, offsetY)

		BaseWall._bounds = [
			self.data.bounds.x.min - self.width * 2 - self.coordOffset,
			self.data.bounds.y.max + self.width + self.coordOffset,
			self.data.bounds.x.max + self.width + self.coordOffset,
			self.data.bounds.y.min - self.width * 2 - self.coordOffset
		]
	}
}
