'use strict'

import BaseWall from './BaseWall'

export default class ReverseWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[3][2], "#9c9c9c")
    }

    penalties(self, player)
	{
        player.stateValues.reverse += player.stateDuration / 4
		super.penalties(self, player)
	}
}
