import BaseBonusOrb from './BaseBonusOrb'

export default class ScoreOrb extends BaseBonusOrb
{
    init(self)
    {
        super.init(self, 1, 1, "#09b900")
    }

    bonus(self, player)
    {
        self.data.information.score += 100
    }
}