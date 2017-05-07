import BaseOrb from './BaseOrb'

export default class BaseBonusOrb extends BaseOrb
{
    init(self, sprite, color)
    {
        super.init(self, sprite, color, true)
    }

    bonus(self)
    {
    }

    destroy(self)
    {
        //self.data.sounds.bonusOrb.play()
    }
}