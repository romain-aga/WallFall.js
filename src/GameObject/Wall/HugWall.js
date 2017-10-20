'use strict'

import MathTools from '../../Tools/MathTools'
import Pools from '../Pools'
import BaseWall from './BaseWall'

export default class HugWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[3][3], "#00de60")
    }

    newCoords(self)
    {
        self.i_newCoord = 5
        let player = Pools.Player.get(0)
        let px = player.x + player.halfWidth
        let py = player.y + player.halfHeight
        self.direction = (MathTools.direction(px, py, self.data.middle.x, self.data.middle.y) + 45) | 0
        self.direction = (self.direction % 360 / 90) | 0
        self.x = (self.direction % 2 === 0) && BaseWall._bounds[self.direction]
            || px - self.halfWidth
        self.y = (self.direction % 2 !== 0) && BaseWall._bounds[self.direction]
            || py - self.halfHeight
    }
}
