import BaseBonusOrb from './BaseBonusOrb'

export default class LifeOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 2, "#c00004")
        self.lifetime /= 2
    }

    bonus(self, player)
    {
        player.lives++
    }
}