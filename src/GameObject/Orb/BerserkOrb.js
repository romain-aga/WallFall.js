'use strict'

import BaseBonusOrb from './BaseBonusOrb'

export default class BerserkOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 7, "#6b0e04")
        self.lifetime /= 2
    }

    bonus(self, player)
    {
        player.stateValues.berserk += player.stateDuration
        super.bonus(self, player)
    }
}