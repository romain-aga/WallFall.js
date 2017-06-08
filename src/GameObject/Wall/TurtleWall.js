'use strict'

import Pools from '../Pools'
import Behaviors from '../Behaviors'
import BaseWall from './BaseWall'

export default class TurtleWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[1][1], "#901602")
        self.maxSpeed = self.speed
        self.speed = 0
    }

    newCoords(self)
    {
        Behaviors.ImmobileWall.newCoords(self)
        self.i_newCoord = 0
    }

    changeSpeed(self)
    {
        Pools.Player.forEach(p => {
            self.speed = self.maxSpeed
            let inHeight = self.y - p.height <= p.y && p.y <= self.y + self.height
            let inWidth = self.x - p.width <= p.x && p.x <= self.x + self.width
            if (self.x <= p.x && inHeight)
                self.direction = 0
            else if (p.x + p.width <= self.x + self.width && inHeight)
                self.direction = 2
            else if (self.y <= p.y && inWidth)
                self.direction = 3
            else if (p.y + p.height <= self.y + self.height && inWidth)
                self.direction = 1
            else
                self.speed = 0
        })
    }
}
