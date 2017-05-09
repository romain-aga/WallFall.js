import BaseWall from './BaseWall'

export default class ResizeWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[4][2], "#383700")
    }

    penalties(self, player)
	{
        self.data.game.durations.resizeWall += player.stateDuration
		super.penalties(self, player)
	}

    draw(self)
    {
        self.cleanDrawing()
        super.draw(self)
    }
}
