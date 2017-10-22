'use strict'

import BaseWall from './BaseWall'

export default class TurnBackWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[0][4], "#514f98")
    }

    newCoords(self)
    {
        if (self.initialized)
            self.direction = (self.direction + 2) % 4
        else
            super.newCoords(self)
    }
}
