import BaseBonusOrb from './BaseBonusOrb'

export default class StopOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 6, "#6c6c6c")
    }

    bonus(self, player)
    {
        self.data.game.stopWall += player.stateDuration
    }

    destroy(self)
    {
        if (self.taken)
            self.data.sounds.orbStop.play()
    }
}