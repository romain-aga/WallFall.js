import BaseWall from './BaseWall'
import Collision from '../../Tools/Collision'
import MathTools from '../../Tools/MathTools'
import Random from '../../Tools/Random'
import Pools from '../Pools'

export default class ImmobileWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[1][0], "#414141")
        self.speed = 0
    }

    newCoords(self)
	{
		self.i_newCoord = 5
		let findNewCoords = true
        let tries = 30
		while (findNewCoords && 0 < tries--)
		{
			self.x = Random.range(self.data.bounds.x.min, self.data.bounds.x.max - self.width)
            self.y = Random.range(self.data.bounds.y.min, self.data.bounds.y.max - self.height)
            findNewCoords = Pools.Wall.find(w => w !== self && Collision.rectRect(self, w))
                || Pools.Orb.find(s => Collision.circleRect(s, self))
                || Pools.Player.find(
                    p => MathTools.squareDistance(p.x, p.y, self.x, self.y) < MathTools.sqpw(p.width + self.width + 20))
		}
        this.explosion(self, 1)
    }
}
