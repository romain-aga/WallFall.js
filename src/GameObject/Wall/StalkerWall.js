'use strict'

import Random from '../../Tools/Random'
import Pools from '../Pools'
import BaseWall from './BaseWall'

export default class StalkerWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[0][2], "#02eaa3")
    }

    newCoords(self)
    {
        self.i_newCoord = 5
        self.direction = Random.range(0, 3)
        let player = Pools.Player.get(0)
        self.x = (self.direction % 2 === 0) && BaseWall._bounds[self.direction]
            || player.x + player.halfWidth - self.halfWidth
        self.y = (self.direction % 2 !== 0) && BaseWall._bounds[self.direction]
            || player.y + player.halfHeight - self.halfHeight
    }
}
