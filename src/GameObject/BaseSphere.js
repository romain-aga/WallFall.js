import Random from '../Tools/Random'
import MathTools from '../Tools/MathTools'
import GameObjectBehavior from './GameObjectBehavior'
import Pool from './Pool'

export default class BaseSphere extends GameObjectBehavior
{
	init(self, sprite, color, isUnique=false)
	{
		self.sprite = sprite
		self.width = self.sprite.width
		self.height = self.sprite.height
		self.color = color
        self.isUnique = isUnique
		this.newCoords(self)
        this.explosion(self)
	}

	newCoords(self)
	{
        let findNewCoords = true
        do
        {
            self.x = self.data.bounds.x.min + Random.range(0, self.data.width - self.width)
            self.y = self.data.bounds.y.min + Random.range(0, self.data.height - self.height)
            findNewCoords = Pool.pools.walls.find(
				function isInWall(w)
                {
                    let width = self.width + w.width
                    let height = self.height + w.height
                    return w.x - self.width <= self.x && self.x <= w.x + w.width + self.width
                        && w.y - self.height <= self.y && self.y <= w.y + w.height + self.height
                        && w.x - width <= self.x
                }
			)
        }
		while (findNewCoords)
	}

    update(self)
    {
        this.collision(self)
    }

	bonus(self)
	{

	}

	explosion(self)
	{
        Pool.pools.explosions.create(self.x, self.y, self.width, self.color)
	}

	collision(self)
	{
        Pool.pools.players.forEach(
            p => {
                if (MathTools.squareDistance(self.x, self.y, p.x, p.y) < 625)
                {
                    this.bonus(self)
                    this.explosion(self)
                    if (! self.isUnique)
                        this.newCoords(self)
                    else
                        self.destroy()
                }
            }
        )
	}
}