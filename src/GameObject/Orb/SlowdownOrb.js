import BaseBonusOrb from './BaseBonusOrb'

export default class SlowdownOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 6, "#6c6c6c")
    }

    bonus(self, player)
    {
        
    }

    destroy(self)
    {
        //self.data.sounds.slowdownOrb.play()
    }
}