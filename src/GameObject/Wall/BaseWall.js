import Random from '../../Tools/Random'
import Collision from '../../Tools/Collision'
import MathTools from '../../Tools/MathTools'
import GameObjectBehavior from '../GameObjectBehavior'
import Pools from '../Pools'
import New from '../New'

export default class BaseWall extends GameObjectBehavior
{
	constructor()
	{
		super('Wall')
	}

	init(self, sprite, color)
	{
		self.sprite = sprite
		self.width = self.sprite.width
		self.height = self.sprite.height
		self.color = color
		//self.data.sounds.levelUp.play()
		self.i_particle = 0
		self.i_newCoord = 0
		self.speed = 2.82
		self.coordOffset = 80
		this.newCoords(self)
	}

	newCoords(self)
	{
		BaseWall._bounds = BaseWall._bounds || [
			self.data.bounds.x.min - self.width * 2 - self.coordOffset,
			self.data.bounds.y.max + self.width + self.coordOffset,
			self.data.bounds.x.max + self.width + self.coordOffset,
			self.data.bounds.y.min - self.width * 2 - self.coordOffset
		]
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
		player.stateValues.god = player.stateDuration
	}

	update(self)
	{
		let rad = MathTools.rads(self.direction * 90)
		let cos = Math.cos(rad)
		let sin = Math.sin(rad)
		let distanceRespawn = self.data.width / 2 + self.width
		if (self.direction === 0 && self.data.bounds.x.max < self.x
			|| self.direction === 1 && self.y < self.data.bounds.y.min - self.width
			|| self.direction === 2 && self.x < self.data.bounds.x.min - self.width
			|| self.direction === 3 && self.data.bounds.y.max < self.y
		)
			this.newCoords(self)
		else
		{
			self.x += cos * self.speed
			self.y -= sin * self.speed
		}
		this.special(self)
		this.collision(self)
		this.particles(self)
	}

	special(self)
	{

	}

	explosion(self, particleSpeed)
	{
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
			New.Particle(self.x, self.y, direction, speed, self.width, self.color, true, decreaseSpeed)
		}
	}

	collision(self)
	{
		Pools.Player.forEach(
            p => p.state !== p.states.god && Collision.circleRect(p, self)
				&& (
					p.state !== p.states.berserk
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
}
