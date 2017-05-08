import BaseBonusOrb from './BaseBonusOrb'

export default class TimeOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 4, "#c400c9")
    }

    bonus(self, player)
    {
        player.time += 30000
    }
}