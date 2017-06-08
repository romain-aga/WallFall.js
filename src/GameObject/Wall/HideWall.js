'use strict'

import BaseWall from './BaseWall'

export default class HideWall extends BaseWall
{
    constructor(data)
    {
        super()
        this.color = "#ffe200"
        this.sprite = data.wallSprites[0][3]
    }

    init(self)
    {
        super.init(self, this.sprite, this.color)
    }

    penalties(self, player)
	{
        self.data.game.durations.hideWall += player.stateDuration
		super.penalties(self, player)
	}
}
