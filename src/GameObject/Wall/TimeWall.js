import BaseWall from './BaseWall'

export default class TimeWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[2][0], "#7c029b")
    }

    penalties(self, player)
	{
        player.time -= 30000
		super.penalties(self, player)
	}
}
