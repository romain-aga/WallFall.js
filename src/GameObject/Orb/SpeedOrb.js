import BaseBonusOrb from './BaseBonusOrb'

export default class SpeedOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 3, "#006aff")
    }

    bonus(self, player)
    {
        player.maxSpeed += 5
    }
}