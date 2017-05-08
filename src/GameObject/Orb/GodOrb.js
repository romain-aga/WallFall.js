import BaseBonusOrb from './BaseBonusOrb'

export default class GodOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 5, "#fe6c00")
    }

    bonus(self, player)
    {
        player.stateValues.god += player.stateDuration
    }
}