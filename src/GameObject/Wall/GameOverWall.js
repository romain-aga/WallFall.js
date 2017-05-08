import BaseWall from './BaseWall'

export default class GameOverWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[3][1], "#630001")
        self.speed *= 0.5
    }

    penalties(self, player)
    {
        player.lives = 0
    }
}
