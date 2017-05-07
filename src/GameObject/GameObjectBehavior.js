import MathTools from '../Tools/MathTools'

export default class GameObjectBehavior
{
	constructor()
	{
		GameObjectBehavior[this.constructor.name] = this
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
	
	destroy(self)
	{
	}
}
