'use strict'

import MathTools from '../Tools/MathTools'

export default class GameObjectBehavior
{
	constructor()
	{
		this.poolName = this.constructor.name
	}

	init(self)
	{
	}
	
	update(self)
	{
        if (self.speed)
        {
            let rad = MathTools.rads(self.direction)
            self.x += Math.cos(rad) * self.speed
            self.y -= Math.sin(rad) * self.speed
        }
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
