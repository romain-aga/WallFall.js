'use strict'

import BaseWall from './BaseWall'

export default class SpeedWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[4][0], "#0010ff")
        self.speed *= 1.5
    }
}
