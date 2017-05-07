import BaseBonusOrb from './BaseBonusOrb'

export default class BerserkOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 7, "#6b0e04")
    }

    bonus(self, player)
    {
        player.stateValues.berserk += 500
        super.bonus(self, player)
    }
}