import BaseOrb from './BaseOrb'

export default class Orb extends BaseOrb
{
    init(self)
    {
        super.init(self, self.data.orbSprites[1][0], "#ff8e00")
    }

    bonus(self, player)
    {
        self.data.information.level += 1
        self.data.information.score += 10
    }
}
