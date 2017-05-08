import BaseWall from './BaseWall'

export default class ScoreWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[0][1], "#05a000")
    }

    penalties(self, player)
	{
        player.score -= 200
		super.penalties(self, player)
	}
}
