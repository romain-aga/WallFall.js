import Random from '../../Tools/Random'
import MathTools from '../../Tools/MathTools'
import Collision from '../../Tools/Collision'
import GameObjectBehavior from '../GameObjectBehavior'
import Pools from '../Pools'
import New from '../New'

export default class BaseOrb extends GameObjectBehavior
{
    constructor()
	{
		super('Orb')
	}

	init(self, sprite, color, isUnique=false)
	{
		self.sprite = sprite
		self.width = self.sprite.width
		self.height = self.sprite.height
		self.color = color
        self.isUnique = isUnique
        self.taken = false
		this.newCoords(self)
        this.explosion(self)
	}

	newCoords(self)
	{
        self.taken = false
        let findNewCoords = true
        do
        {
            self.x = self.data.bounds.x.min + Random.range(0, self.data.width - self.width)
            self.y = self.data.bounds.y.min + Random.range(0, self.data.height - self.height)
            findNewCoords = Pools.Wall.find(w => Collision.circleRect(self, w))
        }
		while (findNewCoords)
	}

    update(self)
    {
        this.collision(self)
    }

	bonus(self, player)
	{

	}

	explosion(self)
	{
        New.Explosion(self.x, self.y, self.width, self.color, false, ! self.taken && 1)
	}

	collision(self)
	{
        Pools.Player.forEach(
            p => {
                if (Collision.circleCircle(self, p))
                {
                    self.taken = true
                    this.bonus(self, p)
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