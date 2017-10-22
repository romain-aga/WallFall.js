'use strict'

import MathTools from '../Tools/MathTools'
import Collision from '../Tools/Collision'

export default class GameObjectBehavior
{
	constructor()
	{
		this.poolName = this.constructor.name
	}

	init(self)
	{
	}
	
	updateWater(self, direction, speed, collisionMethod = Collision.dotCircle)
	{
		if (! speed)
			return
		self.data.waters.waters
			.filter(w => w.alpha)
			.forEach(w => w.springs
				.forEach(s => {
					if (collisionMethod(s, self))
						s.speed += MathTools.angleFactor(s.direction, direction) * speed
				}))
	}

	update(self)
	{
        if (self.speed)
        {
			this.updateWater(self)
            let rad = MathTools.rads(self.direction)
            self.x += Math.cos(rad) * self.speed
            self.y -= Math.sin(rad) * self.speed
        }
	}

	onWindowResize(self, offsetX, offsetY)
	{
		self.x += offsetX
		self.y += offsetY
	}
	
	draw(self)
	{
		self.data.context.drawImage(self.sprite, self.x | 0, self.y | 0)
	}

	updateRectToClean(self, rect)
	{
		rect.x = (self.x - 1) | 0
		rect.y = (self.y - 1) | 0
		rect.w = (self.width + 2) | 0
		rect.h = (self.height + 2) | 0
	}
	
	destroy(self)
	{
	}
}
