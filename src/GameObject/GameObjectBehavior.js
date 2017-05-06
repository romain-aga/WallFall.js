import MathTools from '../Tools/MathTools'

export default class GameObjectBehavior
{
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
		self.data.context.drawImage(self.sprite, self.x, self.y)
	}
	
	destroy(self)
	{
	}
}
