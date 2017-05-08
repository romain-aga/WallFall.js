import Pools from '../Pools'
import Behaviors from '../Behaviors'
import BaseWall from './BaseWall'

export default class TrackerWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[4][1], "#6c1404")
        self.maxSpeed = self.speed
    }

    changeSpeed(self)
    {
        Behaviors.TurtleWall.changeSpeed(self)
        self.speed = self.maxSpeed
    }
}
