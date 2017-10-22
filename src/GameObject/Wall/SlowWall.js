'use strict'

import BaseWall from './BaseWall'

export default class SlowWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[2][1], "#3d3d3d")
    }

    penalties(self, player)
	{
        player.maxSpeed /= 2
        super.penalties(self, player)
	}
}
