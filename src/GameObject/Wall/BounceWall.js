'use strict'

import Collision from '../../Tools/Collision'
import Pools from '../Pools'
import BaseWall from './BaseWall'

export default class BounceWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[3][0], "#960000")
        self.bouncing = false
    }

    collision(self)
    {
        super.collision(self)
        self.bouncing = Pools.Wall.find(
            w => {
                if (w === self || ! Collision.rectRect(w, self))
                    return false
                if (! self.bouncing)
                {
                    let dx = self.x - w.x
                    let dy = self.y - w.y
                    if (Math.abs(dx) < Math.abs(dy))
                        self.direction = (dy < 0 ? 1 : 3)
                    else
                        self.direction = (dx < 0 ? 2 : 0)
                }
                return true
            })
    }
}
