'use strict'

import BaseBonusOrb from './BaseBonusOrb'

export default class SlowdownOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 2, 1, "#17cc71")
        self.lifetime /= 2
    }

    bonus(self, player)
    {
        self.data.game.durations.slowWall += player.stateDuration
    }
}