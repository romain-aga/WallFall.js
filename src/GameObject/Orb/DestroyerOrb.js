'use strict'

import BaseBonusOrb from './BaseBonusOrb'
import Pools from '../Pools'

export default class DestroyerOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 2, 0, "#8300d6")
        self.lifetime /= 4
    }

    bonus(self, player)
    {
        for (let i = 0; i < Pools.Wall.length && i < 3; ++i)
            Pools.Wall.get(0).destroy()
    }
}