import BaseBonusOrb from './BaseBonusOrb'

export default class LifeOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 2, "#c00004")
    }

    bonus(self, player)
    {
        player.lives++
    }
}