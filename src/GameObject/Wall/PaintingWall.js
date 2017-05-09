import BaseWall from './BaseWall'

export default class PaintingWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[1][3], "#ffe200")
    }

    penalties(self, player)
	{
        self.data.game.durations.clearScreen += player.stateDuration
		super.penalties(self, player)
	}
}
